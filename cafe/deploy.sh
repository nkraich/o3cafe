#! /bin/sh

APP=cafe
USER=o3software
HOST=o3software.com

echo "Building app."
meteor build .
mv $APP.tar.gz $USER.tar.gz

echo "Sending build."
scp $USER.tar.gz root@$HOST:/home/$USER
#rm $USER.tar.gz

echo "Deploying on server."
ssh root@$HOST "
  cd /home/$USER
  tar -zxf /home/$USER/$USER.tar.gz
  rm -rf /home/$USER/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt/
  cd /home/$USER/bundle/programs/server
  npm install
  cp -r /home/$USER/bundle/programs/server/node_modules/bcrypt /home/$USER/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt/
  restart $USER
"
