class RoleManager {
  constructor(){
    this.routes = {
      ADMIN: "/admin",
      COMMUTER: "/transport",
      OPERATOR: "/operator"
    }
  }

  getStartingRoute(role){
    return this.routes[role]
  }
}

export default new RoleManager()
