#!/bin/bash

psql -d postgres -f ./postgres-setup.sql --echo-all

npm install
exit 0