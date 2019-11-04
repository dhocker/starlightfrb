/*
    AtHome Control
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

import React from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import $ from 'jquery';
import { BaseComponent } from './base_component';


export class EditController extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
          ...this.state,
          ...{
            controller: {
              type: "LED",
            },
            modalShow: false,
            modalTitle: "",
            modalSubtitle: "",
            modalText: "",
          }
        };

        this.onControlChange = this.onControlChange.bind(this);
        this.onControllerTypeClick = this.onControllerTypeClick.bind(this);
        this.onGoBack = this.onGoBack.bind(this);
        this.onSave = this.onSave.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.generateTitle = this.generateTitle.bind(this);
    }

    // This will load the table when the component is mounted
    componentDidMount() {
        this.loadForm(this.props.match.params.id);
    }

    // This can be called to initially load or refresh the form
    // after inserts, updates or deletes
    loadForm(deviceid) {
        const $this = this;
        const url = `/controller/${deviceid}`;
        $.ajax({
          url: url,
          success: function (response /* , status */) {
              $this.setState({controller: response.data});
          },
          error: function(jqxhr, status, msg) {
            const response = JSON.parse(jqxhr.responseText);
            $this.showMessage(`${status}, ${msg}, ${response.message}`);
          }
        });
    }

    onControlChange(event) {
      let fieldName = event.target.name;
      let fieldVal = event.target.value;
      switch (fieldName) {
        case "selected":
          fieldVal = event.target.checked;
          break;
        default:
          break;
      }
      this.setState({controller: {...this.state.controller, [fieldName]: fieldVal}});
    }

    onControllerTypeClick(event) {
      let deviceType = event.target.name;
      this.setState({controller: {...this.state.controller, "type": deviceType}});
    }

    onSave() {
      const validate_msg = this.validate(this.state.controller);
      if (validate_msg) {
        this.showMessage(validate_msg);
      }
      else {
        this.saveController(this.state.controller);
      }
    }

    onGoBack() {
        this.props.history.goBack();
    }

    modalClose() {
      // When the saved confirmation is dismissed, go back to the previous URI
      if (!this.save_error) {
        this.props.history.goBack();
      }
      else {
        this.setState({ modalShow: false });
      }
    }

    generateTitle() {
      return <h2>Edit Controller ID {this.state.controller.id}</h2>
    }

    saveController(controller) {
      const url = `/controllers/${controller.id}`;
      const $this = this;

      $.ajax({
        method: "PUT",
        url: url,
        data: controller,
        dataType: "json",
        success: function(data, status, xhr) {
          const msg = `Controller ID ${data['controller-id']} updated`;
          $this.save_error = false;
          $this.showDialogBox("Update Controller", data.message, msg);
        },
        error: function(xhr, status, msg) {
          $this.save_error = true;
          const response = JSON.parse(xhr.responseText);
          $this.showDialogBox("Unable to Update Controller Record", status, `${msg} ${response.message}`);
        }
      });
    }

    validate(controller) {
      if (!controller.name) {
        return "Name is required";
      }
      if (!controller.host) {
        return "Host is required";
      }
      if (!controller.port) {
        return "Port is required";
      }
      if (isNaN(controller.port)) {
        return "Port must be a number"
      }
      if (!["LED", "DMX"].includes(controller.type)) {
        return "Invalid controller type"
      }
      return null
    }

    render() {
      return (
        <>
          {this.generateTitle()}
          {this.generateMessage()}
          <Form>
            <Form.Group controlId="formGroupControllerName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                as="input"
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={this.state.controller.name}
                onChange={this.onControlChange}
              />
            </Form.Group>
            <Form.Group controlId="formGroupControllerHost">
              <Form.Label>Host</Form.Label>
              <Form.Control
                type="text"
                name="host"
                placeholder="Host or server name"
                defaultValue={this.state.controller.host}
                onChange={this.onControlChange}
              />
            </Form.Group>
            <Form.Group controlId="formGroupControllerPort">
              <Form.Label>Port</Form.Label>
              <Form.Control
                type="text"
                name="port"
                placeholder="Host or server port number"
                defaultValue={this.state.controller.port}
                onChange={this.onControlChange}
              />
            </Form.Group>
            <Form.Group controlId="formGroupControllerType">
              <Form.Label>Type</Form.Label>
              <DropdownButton id="controller-type" title={this.state.controller.type}>
                <Dropdown.Item name="LED" onClick={this.onControllerTypeClick}>LED</Dropdown.Item>
                <Dropdown.Item name="DMX" onClick={this.onControllerTypeClick}>DMX</Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <Form.Group controlId="formGroupControllerDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                defaultValue={this.state.controller.description}
                onChange={this.onControlChange}
                placeholder="Controller description"
              />
            </Form.Group>

            <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert" type="button" onClick={this.onSave}>
              Save
            </Button>
            <Button className="btn btn-primary btn-sm btn-extra btn-extra-vert" type="button" onClick={this.onGoBack}>
              Cancel
            </Button>
          </Form>
          {this.renderDialogBox()}
        </>
      );
    };
}
