# -*- coding: utf-8 -*-
#
# AtHome Control
# Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the LICENSE file for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
#

"""
How to send JSON from Javascript jQuery

  $.ajax({
    method: "PUT", // or POST
    url: url,
    data: JSON.stringify(this.state.rows), // Whatever data you want to send to server
    dataType: "json", // content type being received
    contentType: "application/json", // content type being sent
    processData: false,
    success: function(data, status, xhr) {
        // Handle success
    },
    error: function(xhr, status, msg) {
        // Handle error
    }
  });
"""

from datetime import timedelta, datetime
import json
from app import app
from flask import jsonify, request, make_response
from configuration import Configuration
import logging
from app.models.controllers import Controllers
from app.models.client_commands import get_status, get_scriptlist, run_script, stop_script


logger = logging.getLogger("app")


@app.route("/controllers", methods=['GET'])
def get_controllers():
    res = Controllers.get_all_controllers()
    if res is not None:
        return jsonify({"data": res})
    response = jsonify("Controllers.get_all_controllers() returned None")
    response.status_code = 500
    return response

@app.route("/controller/<id>", methods=['GET'])
def get_controller(id):
    """
    Returns composite light controller information
    :param id: Light controller ID (database record ID)
    :return: jsonified controller information
    """
    controller_record = Controllers.get_controller(id)
    if controller_record is None:
        response = jsonify("Controllers.get_controller({0}) returned None".format(id))
        response.status_code = 500
        return response

    host = controller_record["host"]
    port = int(controller_record["port"])

    status = get_status(host, port)
    if status:
        controller_record.update(status)
    else:
        controller_record["state"] = "OFFLINE"

    scripts = get_scriptlist(host, port)
    controller_record["scripts"] = scripts

    return jsonify({"data": controller_record})

@app.route("/controller/status/<id>", methods=['GET'])
def get_controller_status(id):
    """
    Returns composite light controller information
    :param id: Light controller ID (database record ID)
    :return: jsonified controller information
    """
    controller_record = Controllers.get_controller(id)
    if controller_record is None:
        response = jsonify("Controllers.get_controller({0}) returned None".format(id))
        response.status_code = 500
        return response

    host = controller_record["host"]
    port = int(controller_record["port"])

    status = get_status(host, port)

    return jsonify({"data": status})

@app.route("/controller/<id>/state/run/<script>", methods=['PUT'])
def state_run_script(id, script):
    """
    Set the running LED script
    :return:
    """
    cr = Controllers.get_controller(id)
    response = run_script(script, cr["host"], cr["port"])
    return jsonify(response)


@app.route("/controller/<id>/state/stop", methods=['PUT'])
def state_stop_script(id):
    """
    Stop the running LED script
    :return:
    """
    cr = Controllers.get_controller(id)
    response = stop_script(cr["host"], cr["port"])
    return jsonify(response)

@app.route('/controllers', methods=['POST'])
def _create_controller():
    """
    Save an new controller definition
    :return:
    """
    # NOTE
    # The jQuery $.ajax call sends arguments as the data property
    # in the initiating call. The arguments show up in the
    # request.form property provided by Flask. So,
    # data: { 'state': new_state } --> request.form['state']
    name = request.form['name']
    host = request.form['host']
    port = request.form['port']
    controller_type = request.form['type']
    description = request.form['description']

    new_id = Controllers.insert_controller(name, host, port, controller_type, description)

    # We are obligated to send a json response
    if new_id:
        response = {
            "controller-id": new_id,
            "message": "Created"
        }
        return jsonify(response)

    response = jsonify("Unable to create a new controller record")
    response.status_code = 500
    return response

@app.route('/controllers/<id>', methods=['PUT'])
def _update_controller(id):
    """
    Save an new controller definition
    :return:
    """
    # NOTE
    # The jQuery $.ajax call sends arguments as the data property
    # in the initiating call. The arguments show up in the
    # request.form property provided by Flask. So,
    # data: { 'state': new_state } --> request.form['state']
    name = request.form['name']
    host = request.form['host']
    port = request.form['port']
    controller_type = request.form['type']
    description = request.form['description']

    changed = Controllers.update_controller(id, name, host, port, controller_type, description)

    # We are obligated to send a json response
    if changed:
        response = {
            "controller-id": id,
            "message": "Updated"
        }
        return jsonify(response)

    response = jsonify("Unable to update controller record")
    response.status_code = 500
    return response

@app.route('/controllers/<id>', methods=['DELETE'])
def _delete_controller(id):
    """
    Save an new controller definition
    :return:
    """
    changed = Controllers.delete_controller(id)

    # We are obligated to send a json response
    if changed:
        response = {
            "controller-id": id,
            "message": "Deleted"
        }
        return jsonify(response)

    response = jsonify("Unable to update controller record")
    response.status_code = 500
    return response

def normalize_boolean(str_value):
    """
    Normalize a string representation of a boolean value.
    :param str_value: 'true' or 'false'
    :return: True or False
    """
    v = False
    if isinstance(str_value, int):
        v = not not str_value
    elif isinstance(str_value, str):
        v = str_value.lower() == "true"
    elif isinstance(str_value, bool):
        v = str_value
    return v
