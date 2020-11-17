class RoleManager {
  constructor(){
    this.routes = {
      ADMIN: "/admin",
      COMMUTER: "/",
      OPERATOR: "/operator"
    }
  }

  getStartingRoute(role){
    return this.routes[role]
  }
}

export default new RoleManager()
