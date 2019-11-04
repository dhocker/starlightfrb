#
# StarLight
# Copyright (C) 2016  Dave Hocker (email: AtHomeX10@gmail.com)
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

import socket
import json

class AtHomeClient:
    """

    """
    def __init__(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # This tries to limit long timeouts waiting for connects
        # to offline servers
        self.sock.settimeout(0.5)

    def connect(self, host, port):
        try:
            self.sock.connect((host, port))
        except socket.error as msg:
            return False
        return True

    def send_command(self, command):
        """
        Sends a newline terminated command to the AtHomeLED server
        :param command:
        :return:
        """
        try:
            self.sock.sendall(bytes(command, "utf-8"))
            self.sock.sendall(b"\n")
        except socket.error as msg:
            return False
        return True

    def receive_response(self):
        """
        Receives a newline terminated response from the AtHomeLED server
        :return:
        """
        response = ""
        response_received = False
        while not response_received:
            try:
                c = self.sock.recv(1).decode("utf-8")
                if c != "\n":
                    response += c
                else:
                    response_received = True
            except socket.error as msg:
                return None
        return json.loads(response)

    def close(self):
        """
        Orderly closure of connection
        :return:
        """
        self.send_command("close")
        self.receive_response()
        self.sock.close()
