const Roles = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    USER: "USER",
    STUDENT: "STUDENT",
    ALL: null,
    ADMIN_LEVEL: null,
    SUB_ADMIN_LEVEL: null
}

Roles.ALL= [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER, Roles.STUDENT ]
Roles.ADMIN_LEVEL= [Roles.SUPER_ADMIN, Roles.ADMIN]
Roles.SUB_ADMIN_LEVEL= [Roles.USER, Roles.STUDENT]

module.exports = Roles
