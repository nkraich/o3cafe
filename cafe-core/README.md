Cafe Core
=========

This is the core site functionality for O3 Cafe.  It provides the following
features:

- Main menu
- 2-pane layout
- Member management
- Chat

It also provides APIs to other O3 Cafe modules:

- Main menu and route registration
- Access to member data
- Chat command registration
- Posting
  - Tagging and filtering
  - Image and attachment uploading

`cafe-core` provides the main layout template, manages routing, and generally
provides all top-level functionality for the site.  The `cafe` wrapper app
includes `cafe-core` along with any desired modules.
