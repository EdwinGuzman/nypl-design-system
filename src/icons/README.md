# NYPL Design System Icons

This package holds the icons for the Design System.  

`/scripts/build-icon.js` compiles the icons into `dist/img/sprite/sprite.svg`.  
The other Design System packages should consume this `sprite.svg` file.


# Using Icons in the Design System
You should not have to install icons - it should be installed by react-components or twig.  
However, you will have to configure loading them, via webpack or whatever you are using.  
Generally, this should be configured via file-loader, as icons.svg is a pre-compilled file.  

However, Babel.
