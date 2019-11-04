# -*- coding: utf-8 -*-
#
# Starlight FRB
# Copyright © 2019  Dave Hocker
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# See the LICENSE file for more details.
#

#
# AtHomePowerlineServer database
#

import sqlite3
import os.path
import datetime
import logging
from configuration import Configuration

logger = logging.getLogger("server")


#######################################################################
class StarlightDb:
    DatabaseFileName = "StarlightFRB.sqlite3"

    def __init__(self):
        pass

    #######################################################################
    @classmethod
    def Initialize(cls):
        if os.path.isfile(Configuration.get_database_file_path(cls.DatabaseFileName)):
            # Database exists
            logger.info("Using database file: %s",
                        Configuration.get_database_file_path(cls.DatabaseFileName))
        else:
            # Database needs to be created
            cls.CreateDatabase()
            logger.info("Created database file: %s",
                        Configuration.get_database_file_path(cls.DatabaseFileName))

    @classmethod
    def CreateDatabase(cls):
        """
        Create an empty database
        :return: None
        """
        # This actually creates the database file if it does not exist
        conn = cls.GetConnection()

        # Create tables (Sqlite3 specific)
        # SchemaVersion (sort of the migration version)
        conn.execute("CREATE TABLE SchemaVersion (Version text, updatetime timestamp)")
        conn.execute("INSERT INTO SchemaVersion values (?, ?)", ("0.0.0.1", datetime.datetime.now()))
        conn.commit()

        # Light controllers
        conn.execute("CREATE TABLE Controllers (id integer PRIMARY KEY, \
                     name text, host text, port integer, type text, description text)")

        # Done
        conn.close()

    #######################################################################
    # Returns a database connection
    @classmethod
    def GetConnection(cls):
        conn = sqlite3.connect(Configuration.get_database_file_path(cls.DatabaseFileName))
        # We use the row factory to get named row columns. Makes handling row sets easier.
        conn.row_factory = sqlite3.Row
        # The default string type is unicode. This changes it to UTF-8.
        conn.text_factory = str
        # Enable foreign keys for this connections
        conn.execute("PRAGMA foreign_keys = ON")
        conn.commit()
        return conn

    #######################################################################
    @classmethod
    def GetCursor(cls, conn):
        return conn.cursor()
