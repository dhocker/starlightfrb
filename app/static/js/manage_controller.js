/*
    Starlight FRB
    Copyright © 2019  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { BaseComponent } from './base_component'
import { ScriptControl } from "./script_control"
import $ from 'jquery';

export class ManageController extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
          title: props.title,
          id: 0,
          host: "",
          port: 0,
          scripts: [],
          state: "UNKNOWN",
          scriptfile: "",
          ready: false,
          ...this.state
        };

        this.getControllerInfo = this.getControllerInfo.bind(this);
        this.getControllerStatus = this.getControllerStatus.bind(this);
        this.globalActions = this.globalActions.bind(this);
        this.onDialogOK = this.onDialogOK.bind(this);
        this.onDialogCancel = this.onDialogCancel.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    // This will load the table when the component is mounted
    componentDidMount() {
        const { match: { params } } = this.props;
        // all programs for a device
        this.setState({
          title: `${this.props.title} ID ${params.id}`
        });

        this.getControllerInfo(params.id);

        // The controller info needs to be updated periodically (10 sec)
        this.intervalTimer = setInterval(this.updateStatus, 10 * 1000);
    }

    componentWillUnmount() {
      // Kill the status update timer
      clearInterval(this.intervalTimer);
    }

    updateStatus() {
        const { match: { params } } = this.props;
        this.getControllerStatus(params.id);
    }

    getControllerInfo(id) {
        const notThis = this;
        const url = `/controller/${String(id)}`;
        $.ajax({
          method: "GET",
          url: url,
          success: function (response /* , status */) {
            notThis.setState({
              title: `${notThis.props.title} ${response.data.name}: ${response.data.description}`,
              ready: true,
              ...response.data
            });
          },
          error: function(jqxhr, status, msg) {
            const response = JSON.parse(jqxhr.responseText);
            notThis.showDialogBox(msg, status, response.message);
          }
        });
    }

    getControllerStatus(id) {
        const notThis = this;
        const url = `/controller/status/${String(id)}`;
        $.ajax({
          method: "GET",
          url: url,
          success: function (response /* , status */) {
            notThis.setState({
              ready: true,
              ...response.data
            });
          },
          error: function(jqxhr, status, msg) {
            const response = JSON.parse(jqxhr.responseText);
            notThis.showDialogBox(msg, status, response.message);
          }
        });
    }

    // Override to provide "per record" actions
    getActions(row_index, row) {
        return (
          <td>
            <LinkContainer to={"/editprogram/" + String(row.id)}>
              <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert">Edit</Button>
            </LinkContainer>
            <Button className="btn btn-danger btn-sm btn-extra btn-extra-vert" onClick={this.onProgramRemove.bind(this, row_index)}>Remove</Button>
          </td>
        );
    };


    // Override to provide global actions at the head/foot of the table
    globalActions() {
        // Use Link or button depending on required action
        // This still doesn't work right
        const { match: { params } } = this.props;
        return (
          <div>
            <LinkContainer to={"/device/" + String(params.id) + "/newprogram"}>
              <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert">New Program</Button>
            </LinkContainer>
          </div>
        );
    }

    onDialogOK() {
      const $this = this;
      const rows = this.state.rows;
      const row_index = this.remove_row_index;
      const url = `/programs/${rows[row_index].id}`;

      $.ajax({
        method: "DELETE",
        url: url,
        data: {},
        dataType: "json",
        success: function(data, status, xhr) {
          $this.showMessage(`Program ${rows[row_index]["name"]} removed`);
          const { match: { params } } = $this.props;
          // Reload the programs for the current device
          const url = `/devices/${params.id}/programs`;
          $this.loadTable(url);
        },
        error: function(xhr, status, msg) {
          const response = JSON.parse(xhr.responseText);
          $this.showDialogBox("Remove Program", status, `${msg} ${response}`);
        }
      });
      this.setState({ okCancelShow: false });
    }

    onDialogCancel() {
      this.setState({ okCancelShow: false });
    }

    onRun() {
      console.log("manager_controller:onRun");
      this.getControllerStatus(this.state.id);
    }

    onStop() {
      console.log("manager_controller:onRun");
      this.getControllerStatus(this.state.id);
    }

    render() {
        return (
            <div className="container">
              <h2>{this.state.title}</h2>
              {this.generateMessage()}

              <div className="card">
                <div className="card-header">
                  <h3>Status</h3>
                </div>
                {this.generateStatus()}
              </div>

              {this.generateScriptControl()}

              {this.renderDialogBox()}
              {this.renderOKCancelDialogBox()}
            </div>
        );
    }

    generateStatus() {
      if (!this.state.ready) {
        return "";
      }
      return (
        <div className="card-body">
          <p>ID: {this.state.id}</p>
          <p>Server: {this.state.host}:{this.state.port}</p>
          <p>State: {this.state.state} {this.state.scriptfile}</p>
        </div>
      );
    }

    generateScriptControl() {
      if (!this.state.ready) {
        return "";
      }
      return (
        <ScriptControl
          controller_id={this.state.id}
          defaultValue={this.state.scriptfile}
          host={this.state.host}
          port={this.state.port}
          onChange={null}
          onRun={this.onRun}
          onStop={this.onStop}
          script_rows={this.state.scripts}
          ref={(instance) => {
              this.scriptControlInstance = instance;
          }}
        />
      )
    }
}

ManageController.propTypes = {
    class: PropTypes.string.isRequired,
};

// Defaults for a standard device programs table
ManageController.defaultProps = {
    title: "Controller",
    class: "table table-striped table-condensed",
    bordered: true,
    striped: true,
    size: "sm"
};
