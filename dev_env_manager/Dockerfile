FROM node:10-alpine

WORKDIR /usr/app

ARG build_branch
ENV BUILD_BRANCH=${build_branch}

ARG type
ENV TYPE=${type}

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

RUN git clone -b ${BUILD_BRANCH} https://github.com/NYPL/nypl-design-system.git .

RUN npm install lerna pm2 -g

RUN npm run install-all

CMD ["pm2-runtime", "npm run storybook:${TYPE}"]
