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

function About(props) {
  return (
    <div className="card my-5">
      <div className="card-body">
        <h5 className="card-title">About Starlight FRB</h5>
        <p className="card-text">
          This is the newest iteration of Starlight developed using
          Python 3, Flask, React, Booststrap 4 and Webpack. Essentially, Starlight is
          a web app front end (a client) for managing instances of AtHomeLED and AtHomeDMX.
        </p>
        <p className="card-text">
          Starlight can manage two different types of lighting controllers:
          <a
            className="card-link-x"
            href="https://github.com/dhocker/athomeled"
          >
            &nbsp;AtHomeLED&nbsp;
          </a>
          and
          <a
            className="card-link-x"
            href="https://gethub.com/dhocker/athomedmx"
          >
            AtHomeDMX
          </a>.
          AtHomeLED is a controller for LED strings based on WS281X or APA102 LEDs. AtHomeDMX
          is a controller for DMX lighting systems.
        </p>
        <p className="card-text">
          Find out more about Starlight FRB at
          <a
            className="card-link"
            href="https://github.com/dhocker/starlight"
          >
            &nbsp;https://github.com/dhocker/starlight
          </a>.
        </p>
      </div>
    </div>
)};

export default About;
