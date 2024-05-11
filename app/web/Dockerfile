# Use a minimal Ubuntu base image
FROM ubuntu:latest

# Set the working directory
WORKDIR /web

# Set noninteractive mode to prevent prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package repositories and install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    supervisor \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    wget \
    curl \
    nano \
    iproute2 \
    sqlite3 \
    python3-pip \
    python3-venv \
    python3-dev \
    lsb-release \
    git \
    make \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    llvm \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libffi-dev \
    openssh-server \
    unzip \
    liblzma-dev 
    
    

# Set up SSH
RUN mkdir /var/run/sshd && chmod 755 /var/run/sshd \
    #&& mkdir /root/.ssh && chown root. /root/.ssh && chmod 700 /root/.ssh \
   # && ssh-keygen -A \
    && echo 'root:test' | chpasswd \
    && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config \
    && echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config \
    && echo "ServerAliveInterval 60" >> /etc/ssh/ssh_config \
    && echo "ServerAliveCountMax 120" >> /etc/ssh/ssh_config \
    && echo "Port 6000" >> /etc/ssh/sshd_config \
    && echo "X11Forwarding yes" >> /etc/ssh/sshd_config \
    && echo "X11DisplayOffset 10" >> /etc/ssh/sshd_config \
    && echo "X11UseLocalhost no" >> /etc/ssh/sshd_config \
    && echo "LD_LIBRARY_PATH=/usr/lib64-nvidia" >> /root/.bashrc \
    && echo "export LD_LIBRARY_PATH" >> /root/.bashrc
      

# Install pyenv
ENV PYENV_ROOT /opt/pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH
RUN curl https://pyenv.run | bash \
    && echo 'eval "$(pyenv init --path)"' >> ~/.bashrc

# Install Python 3.10 and set it as the default version
RUN pyenv install 3.10.0 \
    && pyenv global 3.10.0 
    
# Use nvm to install Node.js version 18
# Install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" \
    && nvm install 18 \
    && nvm alias default 18

# Install Node.js version 18 and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    # Install Yarn
    && curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends yarn \
    # Install rtlcss
    && npm install -g rtlcss


# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy the entrypoint script into the container
COPY entrypoint.sh /web/entrypoint.sh

# Set permissions for the /web directory
RUN chmod 755 /web \
    && chmod +x /web/entrypoint.sh

# Copy the rest of your application code
COPY . /web/

# Set the entrypoint script as the default command to run when the container starts
CMD ["/web/entrypoint.sh"]
