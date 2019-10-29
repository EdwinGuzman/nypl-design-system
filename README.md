![NYPL Logo](./screenshot.png)

# NYPL Design System
Information about the Design System, philosophy, and timeline is available on [Confluence](https://confluence.nypl.org/pages/viewpage.action?spaceKey=DIGTL&title=Design+Systems+Forum) 

## Getting Started
This repo is versioned with [Lerna](https://github.com/lerna/lerna).  
To use Patternlab, you must have installed PHP7+ and [https://getcomposer.org/](composer)

Follow these steps for setup: 
 
1. Pull the repo `git clone https://github.com/NYPL/nypl-design-system.git`
2. Install Lerna globally `npm i -g lerna`
3. Install all the packages `npm run install-all`
4. Run `npm run patternlab` or `npm run storybook` depending on the product you are working on. 

You can now edit styles or templates in `src`, and they will update and re-build.  

## Troubleshooting
While we are getting our `lerna` process ironed out, packages will sometimes not get pulled in correctly.  When this happens, auto-rebuild can be broken.  If a single package is not found, cd into the directory and run `npm link {package name}`.  

If it looks like a larger build error, eg: 
* cb() not called
* Cannot read package.json.[random string of numbers]

Remove `node_modules` and `package-lock.json` from the `storybook` or `patternlab` directories, and re-build them using `npm install`.  After installing, run `lerna link` from root to symlink the packages together again.  

## Working with Design System Modules
By default, the repo links everything under `src` for local development.  Sometimes, development may need to happen under a fixed version of `styles`. 
1. Navigate to `package.json` of `patternlab` or `storybook`, whichever is applicable
2. Under `devDependencies`, change the `file:../src/styles` to whichever the a fixed `styles` version
3. re-run `npm install` under the repo.  You may need to remove `node_modules` and/or `package-lock.json`, depending on whether the install is throwing errors

## Publishing
You can publish npm modules from this repo by running:
```lerna publish```

`storybook` and `patternlab` are private - their versions should be bumped if there have been changes, but they will not be published. 
The command will only publish modules that have been changed.  

After publishing new packages, remember also to bump the versions (or run `npm update` in `storybook` and/or `patternlab`) so that they will pull in new npm modules.  


