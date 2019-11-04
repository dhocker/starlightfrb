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

import React from "react";
import { EditController } from "./edit_controller";
import $ from 'jquery';


export class NewController extends EditController {
    constructor(props) {
        super(props);

        this.state = {
          ...this.state,
          ...{
            controller: {
              name: "",
              location: "",
              type: "LED",
              address: "",
              selected: false
            },
            modalShow: false,
            modalTitle: "",
            modalSubtitle: "",
            modalText: "",
          }
        };

        this.onSave = this.onSave.bind(this);
        this.generateTitle = this.generateTitle.bind(this);
    }

    componentDidMount() {
    }

    onSave() {
     const validate_msg = this.validate(this.state.controller);
      if (validate_msg) {
        this.showMessage(validate_msg);
      }
      else {
        this.createController(this.state.controller);
      }
    }

    generateTitle() {
      return <h2>New Controller</h2>
    }

    createController(controller) {
      const url = `/controllers`;
      const $this = this;

      $.ajax({
        method: "POST",
        url: url,
        data: controller,
        dataType: "json",
        success: function(data, status, xhr) {
          const msg = `Controller ID ${data['controller-id']} created`;
          $this.save_error = false;
          $this.showDialogBox("New Controller", data.message, msg);
        },
        error: function(xhr, status, msg) {
          $this.save_error = true;
          const response = JSON.parse(xhr.responseText);
          $this.showDialogBox("Unable to Create Controller Record", status, `${msg} ${response.message}`);
        }
      });
    }
}
