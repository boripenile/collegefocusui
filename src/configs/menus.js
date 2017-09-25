export default {
  Setting: {
    routes: [
      { route: '/administrators', materialIcon: 'perm_identity', name: 'Manage Administrators', role: 'superadmin', permission: 'permission:view', children: [] },
      { route: '/roles', materialIcon: 'supervisor_account', name: 'Manage Roles', role: 'superadmin', permission: 'role:view', children: [] },
      { route: '/permissions', materialIcon: 'perm_identity', name: 'Manage Permissions', role: 'superadmin', permission: 'permission:view', children: [] },
      { route: '/services', materialIcon: 'perm_identity', name: 'Manage Services', role: 'superadmin', permission: 'permission:view', children: [] }
    ],
    icon: 'settings',
    role: 'superadmin',
    permission: 'role:create'
  },
  'School Settings': {
    routes: [
      { route: '/academicterms', materialIcon: 'perm_identity', name: 'Academic Terms', role: 'admin', permission: 'academic:term:view', children: [] },
      { route: '/departments', materialIcon: 'supervisor_account', name: 'Manage Departments', role: 'admin', permission: 'department:view', children: [] },
      { route: '',
        materialIcon: 'perm_identity',
        name: 'Sections',
        role: 'admin',
        permission: 'school:section:view',
        children: [
          {
            route: '/schoolsections', materialIcon: 'perm_identity', name: 'School Sections', role: 'admin', permission: 'school:section:view'
          },
          {
            route: '/teachersections', materialIcon: 'perm_identity', name: 'Teachers’ Sections', role: 'admin', permission: 'teacher:section:view'
          }
        ]
      },
      { route: '/schoolclass', materialIcon: 'supervisor_account', name: 'Manage Classrooms', role: 'admin', permission: 'school:class:view', children: [] },
      { route: '/grading', materialIcon: 'supervisor_account', name: 'Grading Policy', role: 'admin', permission: 'school:grade:view', children: [] },
      { route: '',
        materialIcon: 'perm_identity',
        name: 'Subjects',
        role: 'admin',
        permission: 'school:section:view',
        children: [
          {
            route: '/subjects', materialIcon: 'perm_identity', name: 'Manage Subjects', role: 'admin', permission: 'school:subject:view'
          },
          {
            route: '/subjecthemes', materialIcon: 'perm_identity', name: 'Subject Themes', role: 'admin', permission: 'teacher:section:view'
          },
          {
            route: '/classroomsubjects', materialIcon: 'perm_identity', name: 'Classrooms’ Subjects', role: 'admin', permission: 'school:section:view'
          },
          {
            route: '/teachersubjects', materialIcon: 'perm_identity', name: 'Teachers’ Subjects', role: 'admin', permission: 'teacher:section:view'
          },
          {
            route: '/studentsubjects', materialIcon: 'perm_identity', name: 'Students’ Subjects', role: 'admin', permission: 'teacher:section:view'
          }
        ]
      }
    ],
    icon: 'home',
    role: 'admin',
    permission: 'academic:view'
  },
  'System Users': {
    routes: [
      { route: '',
        materialIcon: 'perm_identity',
        name: 'Teaching Staff',
        role: 'admin',
        permission: 'school:section:view',
        children: [
          {
            route: '/teachers', materialIcon: 'perm_identity', name: 'Manage Teachers', role: 'admin', permission: 'school:section:view'
          },
          {
            route: '/teacherroles', materialIcon: 'perm_identity', name: 'Teachers\' Roles', role: 'admin', permission: 'school:section:view'
          },
          {
            route: '/teacherpermissions', materialIcon: 'perm_identity', name: 'Teachers\' Permissions', role: 'admin', permission: 'teacher:section:view'
          }
        ]
      },
      { route: '',
        materialIcon: 'perm_identity',
        name: 'Non-Teaching Staff',
        role: 'admin',
        permission: 'school:section:view',
        children: [
          {
            route: '/otherstaff', materialIcon: 'perm_identity', name: 'Other Staff', role: 'admin', permission: 'school:section:view'
          }
        ]
      },
      { route: '',
        materialIcon: 'perm_identity',
        name: 'Students',
        role: 'admin',
        permission: 'school:section:view',
        children: [
          {
            route: '/students', materialIcon: 'perm_identity', name: 'Manage Students', role: 'admin', permission: 'school:section:view'
          },
          {
            route: '/studentguardian', materialIcon: 'perm_identity', name: 'Students\' Guardian', role: 'admin', permission: 'school:section:view'
          }
        ]
      }
    ],
    icon: 'home',
    role: 'admin',
    permission: 'academic:view'
  }
}
