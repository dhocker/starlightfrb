#
# Devices table model
# Copyright © 2019  Dave Hocker
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, version 3 of the License.
#
# See the LICENSE file for more details.
#

from .starlight_db import StarlightDb
from .base_table import BaseTable
import datetime
import logging

logger = logging.getLogger("server")


class Controllers(BaseTable):
    #######################################################################
    def __init__(self):
        pass

    #######################################################################
    # Empty all records from the table
    @classmethod
    def delete_all_controllers(cls):
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        c.execute("DELETE FROM Controllers")
        conn.commit()
        conn.close()

    @classmethod
    def get_all_controllers(cls):
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        # The results are sorted based on the most probable use
        rset = c.execute("SELECT * from Controllers ORDER BY name, host")
        return cls.rows_to_dict_list(rset)

    @classmethod
    def get_controller(cls, controller_id):
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        rset = c.execute("SELECT * from Controllers WHERE id=:controllerid", {"controllerid": controller_id})
        return cls.row_to_dict(rset.fetchone())

    @classmethod
    def insert_controller(cls, name, host, port, type, description):
        """
        Insert a new controller record
        :param name:
        :param host:
        :param port:
        :param type: LED or DMX
        :param description:
        :return:
        """
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        c.execute("INSERT INTO Controllers (name,host,port,type,description) values (?,?,?,?,?)",
                  (name, host, port, type, description))
        id = c.lastrowid
        conn.commit()
        conn.close()
        return id

    @classmethod
    def update_controller(cls, controller_id, name, host, port, type, description):
        """
        Update an existing controller record
        :param name:
        :param host:
        :param port:
        :param type:
        :param description:
        :return:
        """
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        # SQL update safe...
        # Note that the current time is inserted as the update time. This is added to the
        # row as a convenient way to know when the record was inserted. It isn't used for
        # any other purpose.
        c.execute("UPDATE Controllers SET " \
                    "name=?,host=?,port=?,type=?,description=? WHERE id=?",
                    (name, host, port, type, description, controller_id)
                  )
        conn.commit()
        change_count = conn.total_changes
        conn.close()
        return change_count

    @classmethod
    def delete_controller(cls, controller_id):
        conn = StarlightDb.GetConnection()
        c = StarlightDb.GetCursor(conn)
        c.execute("DELETE FROM Controllers WHERE id=:controllerid", {"controllerid": controller_id})
        conn.commit()
        change_count = conn.total_changes
        conn.close()
        return change_count
