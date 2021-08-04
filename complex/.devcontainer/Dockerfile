#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

# FROM mcr.microsoft.com/vscode/devcontainers/base:focal

# user args
# some base images require specific values
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# copy the stup scripts to the container
COPY library-scripts/*.sh /scripts/
COPY local-scripts/*.sh /scripts/

# install selected components
# many scripts take optional parameters
# see the script header for details of each
RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    # order matters for the next 4 scripts
    # uncomment this line if you're using a base image that is not from vscode/devcontainers
    #&& /bin/bash /scripts/common-debian.sh \
    && /bin/bash /scripts/docker-in-docker-debian.sh \
    && /bin/bash /scripts/kubectl-helm-debian.sh \
    && /bin/bash /scripts/kind-k3d-debian.sh \
    # Optional components
    # uncomment any you want to install
    #&& bash /scripts/azcli-debian.sh \
    #&& bash /scripts/dotnet-debian.sh \
    #&& bash /scripts/git-lfs-debian.sh \
    #&& bash /scripts/github-debian.sh \
    #&& bash /scripts/go-debian.sh \
    #&& bash /scripts/gradle-debian.sh \
    #&& bash /scripts/java-debian.sh \
    #&& bash /scripts/maven-debian.sh \
    #&& bash /scripts/node-debian.sh \
    #&& bash /scripts/powershell-debian.sh \
    #&& bash /scripts/python-debian.sh \
    #&& bash /scripts/ruby-debian.sh \
    #&& bash /scripts/rust-debian.sh \
    #&& bash /scripts/sshd-debian.sh \
    #&& bash /scripts/terraform-debian.sh \
    # set welcome message
    && echo "👋 Welcome to Codespaces! You are on a custom image defined in your devcontainer.json file.\n" > /usr/local/etc/vscode-dev-containers/first-run-notice.txt \
    && echo "🔍 To explore VS Code to its fullest, search using the Command Palette (Cmd/Ctrl + Shift + P)\n" >> /usr/local/etc/vscode-dev-containers/first-run-notice.txt \
    && echo "run 'make all' to build a kind cluster in Codespaces\n\n" >> /usr/local/etc/vscode-dev-containers/first-run-notice.txt

# docker socket required for Docker in Docker
VOLUME [ "/var/lib/docker" ]

# Setting the ENTRYPOINT to docker-init.sh will start up the Docker Engine 
# inside the container "overrideCommand": false is set in devcontainer.json. 
# The script will also execute CMD if you need to alter startup behaviors.
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]
CMD [ "sleep", "infinity" ]

# [Optional] Uncomment this section to install additional OS packages.
# alternatively, you can add commands to on-create.sh and/or post-create.sh
# on-create runs before the Codespaces UI appears
# post-create runs in the background after the UI appears
# RUN apt-get -y install --no-install-recommends <your-package-list-here>

# upgrade packages
# you can improve startup time by runing in post-create.sh
# RUN apt upgrade -y

# # FROM debian:8

# # Avoid warnings by switching to noninteractive
# ENV DEBIAN_FRONTEND=noninteractive

# # Configure apt and install packages
# RUN apt-get update \
#     && apt-get -y install --no-install-recommends apt-utils 2>&1 \
#     #
#     # Install the Azure CLI
#     && apt-get install -y apt-transport-https curl gnupg2 lsb-release \
#     && echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $(lsb_release -cs) main" > /etc/apt/sources.list.d/azure-cli.list \
#     && curl -sL https://packages.microsoft.com/keys/microsoft.asc | apt-key add - 2>/dev/null \
#     && apt-get update
# RUN apt-get install -y azure-cli
# # RUN apt-get install -y azure-cli=2.0.67-1~jessie
# # RUN apt-get install -y azure-cli=2.0.64-1~jessie
# # RUN apt-get install -y azure-cli=2.0.63-1~jessie
# # RUN apt-get install -y azure-cli=2.0.26-1~jessie
# RUN apt-get install \
#     ca-certificates \
#     curl \
#     gnupg \
#     lsb-release
# RUN apt install sudo && apt-get update

# RUN curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# RUN echo \
#   "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
#   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# RUN apt-get update
# RUN apt-get install -y docker-ce docker-ce-cli containerd.io 
# RUN sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
# RUN echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
# RUN sudo apt-get update
# RUN apt-get install -y kubectl 
# # RUN apt install -y zsh




# # Switch back to dialog for any ad-hoc use of apt-get
# ENV DEBIAN_FRONTEND=dialog
