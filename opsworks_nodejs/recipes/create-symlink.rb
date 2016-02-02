#
# Cookbook Name:: nodejs-0.12.0-wrapper
# Recipe:: create-symlink
#
# Copyright (C) 2015 Dimitar Pavlov
#
# All rights reserved - Do Not Redistribute
#

link node["nodebin"]["opsworks_location"] do
  to node["nodebin"]["location"]
end
