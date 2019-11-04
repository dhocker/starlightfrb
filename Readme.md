# Starlight FRB
Copyright © 2019 by Dave Hocker

## Overview

StarlightFRB is a web server app for controlling AtHomeLED and AtHomeDMX servers.
It can manage any number of these servers.

StarlightFRB is written in Python 3, Flask, React and Bootstrap 4. It uses
Sqlite3 for its database.

## License

The StarlightFRB app is licensed under the GNU General Public License v3 as published by the Free Software Foundation, Inc.. See the
LICENSE file for the full text of the license.

## Setup/Installation
You can set up StarlightFRB as a standalone server or as a site under 
NGINX and uWSGI. For uses other than simple testing, NGINX/uWSGI is
recommended.

### Files
* requirements.txt - pip requirements file. Can be used to create the required virtual environment.
    Note that the uwsgi file is set up for a flask virtual environment.
* starlightfrb_nginx_site - nginx configuration file for the app. This file should go in /etc/nginx/sites-available.
    To activate the site, put a symbolic link to the file in /etc/nginx/sites-enabled.
    Edit this file based on your nginx server installation. If AgentMPD is the only web app running
    under nginx, you might not need to make any changes. AgentMPD urls are all prefixed with /mpd so
    they can be routed easily within nginx. The nginx_site file does exactly this.
* emperor.ini - If you want to run emperor mode, put this file in /etc/uwsgi.
* uwsgi_starlightfrb.ini - uwsgi configuration file for the app. This file should go in /etc/uwsgi/apps-available.
    To activate the app for non-Emperor mode, put a symbolic link in /etc/uwsgi/apps-enabled.
    For emperor mode, put this file in /etc/uwsgi/vassals.
    Edit this file based on how you set up your virtualenv. If you rename the file, make sure it ends
    with .ini otherwise uwsgi will not recognize it.
* server.py - useful for testing the app, particularly under PyCharm. This will run the app without
    involving either nginx or uwsgi.
* uwsgi-emperor - If you want to use emperor mode, put this file in /etc/init.d and register it as
    a start up daemon using update-rc.d.

### NGINX

The stock version of nginx that installs through apt-get is usually adequate.

### uWSGI

The stock version of uWSGI that is currently available under Raspbian is usually adequate.
