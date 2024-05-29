#!/bin/bash

echo "estop triggered"
echo "systemctl stop ros-rover-start.service"
sudo systemctl stop ros-rover-start.service