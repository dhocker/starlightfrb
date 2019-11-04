/*
    StarLight-FRB
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
import { Button } from 'react-bootstrap';
import { Select } from './select';
import $ from 'jquery';

/*
    Implements a select element for all of the available scripts
*/

export class ScriptControl extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectValue: props.defaultValue,
        };

        this.setSelectedScript = this.setSelectedScript.bind(this);
        this.getSelectedScript = this.getSelectedScript.bind(this);
        this.resetSelectedScript = this.resetSelectedScript.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.scriptChanged = this.scriptChanged.bind(this);
        this.onRun = this.onRun.bind(this);
        this.onStop = this.onStop.bind(this);
    }

    getSelectedScript() {
        return this.state.scriptValue;
    }

    setSelectedScript(value) {
        this.setState({selectValue: value});
        this.selectInstance.setSelectedOption(value);
    }

    resetSelectedScript() {
        this.setState({scriptValue: this.props.defaultValue});
        this.selectInstance.setSelectedOption(this.props.defaultValue);
    }

    componentDidMount() {
    }

    scriptChanged(event) {
        this.setState({selectValue: event.newValue});
        if (this.props.onChange) {
            const change = {
                oldValue: this.state.selectValue,
                newValue: event.newValue
            };
            // Bubble event
            this.props.onChange(change);
        }
    }

    onRun() {
        if (!this.state.selectValue) {
          console.log("No script selected");
          return;
        }
        const $this = this;
        console.log("Run: " + this.state.selectValue);
        const url = `/controller/${this.props.controller_id}/state/run/${this.state.selectValue}`;
        this.serverRequest = $.ajax({
            type: "PUT",
            url: url,
            data: "",
            success: function (result) {
                console.log(result);
                // TODO Determine if we can update status here
                if ($this.props.onRun) {
                  $this.props.onRun();
                }
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
//                const errormsg = "That author already exists: " + $this.state.lastnameValue +
//                    ", " + $this.state.firstnameValue;
//                errordlg.showErrorDialog("Duplicate Author", errormsg);
                // Note that the dialog box is left open so the user can fix the error
            }
        });
    }

    onStop() {
        const $this = this;
        console.log("Stop: " + this.props.controller_id);
        const url = `/controller/${this.props.controller_id}/state/stop`;
        this.serverRequest = $.ajax({
            type: "PUT",
            url: url,
            data: "",
            success: function (result) {
                console.log(result);
                // TODO Determine if we can update status here
                if ($this.props.onStop) {
                  $this.props.onStop();
                }
            },
            error: function (xhr, status, errorThrown) {
                console.log(status);
                console.log(errorThrown);
                // Show user error
//                const errormsg = "That author already exists: " + $this.state.lastnameValue +
//                    ", " + $this.state.firstnameValue;
//                errordlg.showErrorDialog("Duplicate Author", errormsg);
                // Note that the dialog box is left open so the user can fix the error
            }
        });
    }

    /*
        Generate a select element for the categories
    */
    render() {
        /*
            Select properties
            id - Select element id, string
            selectClass - select element class list, string
            optionClass - option element class list to be applied to each option
                in select list. String.
            options - [{}...{}] array/list of objects containing at least a key/value pair
            keyProp - name of key property in option list
            valueProp - name of value property in option list
            labelProp - name of label property in option list. Can be the same as the value.
            defaultValue - the initial value of the select, string
            onChange(event) - event handler for selection changes. The event is an object
        */
        const disabled = this.state.selectValue === "";
        return (
          <div className="card">
            <div className="card-header">
              <h3>Lighting Script Control</h3>
            </div>
            <div className="card-body">
                <Select
                    id={"selectscript"}
                    size={10}
                    selectClass={"form-control select-script"}
                    optionClass={""}
                    options={this.props.script_rows}
                    defaultValue={this.state.selectValue}
                    keyProp={"id"}
                    valueProp={"script"}
                    labelProp={"script"}
                    onChange={this.scriptChanged}
                    ref={(instance) => {
                        this.selectInstance = instance;
                    }}
                />
            </div>
            <div className="card-footer">
              <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert" onClick={this.onRun}
                disabled={disabled}
              >
                Run
              </Button>
              <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert" onClick={this.onStop}
              >
                Stop
              </Button>
            </div>
          </div>
        );
    }
}

ScriptControl.propTypes = {
    defaultValue: PropTypes.string.isRequired,
    controller_id: PropTypes.number.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    onChange: PropTypes.func,
    onRun: PropTypes.func,
    onStop: PropTypes.func,
    script_rows: PropTypes.array.isRequired,
};

ScriptControl.defaultProps = {
    host: "localhost",
    port: 9999,
    script_rows: [],
    onRun: null,
    onStop: null,
};
