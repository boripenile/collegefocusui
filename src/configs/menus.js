export default {
  Setting: {
    routes: [
      { route: '/administrators', faIcon: 'fa fa-home', materialIcon: 'perm_identity', name: 'Manage Administrators', role: 'superadmin', permission: 'permission:view' },
      { route: '/roles', faIcon: 'fa fa-home', materialIcon: 'supervisor_account', name: 'Manage Roles', role: 'superadmin', permission: 'role:view' },
      { route: '/permissions', faIcon: 'fa fa-home', materialIcon: 'perm_identity', name: 'Manage Permissions', role: 'superadmin', permission: 'permission:view' },
      { route: '/services', faIcon: 'fa fa-home', materialIcon: 'perm_identity', name: 'Manage Services', role: 'superadmin', permission: 'permission:view' }
    ]
  }
}
