# Newsersn Newspaper Python back to front  
# Quik-boot

apt -y install docker-compose

chmod +x app/web/entrypoint.sh

docker-compose up -d

docker-compose exec web /bin/bash

export FLASK_APP=project

export FLASK_DEBUG=1

CodeSandbox LSP: python client: couldn't create connection to server.
