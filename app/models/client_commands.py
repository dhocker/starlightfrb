#
# StarLight
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

from .athome_client import AtHomeClient
from configuration import Configuration

def get_status(server, server_port):
    client = AtHomeClient()
    if client.connect(server, server_port):
        client.send_command("status")
        response = client.receive_response()
        client.close()

        # Normalize scriptfile when controller is stopped
        if response["state"].upper() == "STOPPED":
            response["scriptfile"] = ""
    else:
        response = {"state": "OFFLINE"}

    return response

def get_scriptlist(server, server_port):
    client = AtHomeClient()
    if client.connect(server, server_port):
        client.send_command("scriptfiles")
        response = client.receive_response()
        # Spin list of scripts into a list of dicts with id
        id = 1
        scripts = []
        response["scriptfiles"].sort()
        for f in response["scriptfiles"]:
            scripts.append({"id": id, "script": f})
            id += 1
        client.close()
    else:
        scripts = []

    return scripts

def run_script(script, server, server_port):
    client = AtHomeClient()
    if client.connect(server, server_port):
        client.send_command("start {0}".format(script))
        response = client.receive_response()
        client.close()
    else:
        response = None

    return response

def stop_script(server, server_port):
    client = AtHomeClient()
    if client.connect(server, server_port):
        client.send_command("stop")
        response = client.receive_response()
        client.close()
    else:
        response = None

    return response

def shutdown_controller(server, server_port):
    client = AtHomeClient()
    if client.connect(server, server_port):
        client.send_command("shutdown")
        response = client.receive_response()
        client.close()
    else:
        response = None

    return response
