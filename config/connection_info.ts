 export const connection_info = {
    protocol : "https",
    local_host: "127.0.0.1",
    remote_host: require('ip').address(),
    frontend_port : 4200,
    server_port : 5000,
    local_mode : false
  }
  export const getServerURL = () => {
    if(connection_info.local_mode){
      return `${connection_info.protocol}://${connection_info.local_host}:${connection_info.server_port}`
    }
    else{
      return `${connection_info.protocol}://${connection_info.remote_host}:${connection_info.server_port}`
    }
  }
  export const getServerHost = () => {
    if(connection_info.local_mode){
      return `${connection_info.protocol}://${connection_info.local_host}`
    }
    else{
      return `${connection_info.protocol}://${connection_info.remote_host}`
    }
  }

  export const getFrontEndURL = () => {
    if(connection_info.local_mode){
      return `${connection_info.protocol}://${connection_info.local_host}:${connection_info.frontend_port}`
    }
    else{
      return `${connection_info.protocol}://${connection_info.remote_host}:${connection_info.frontend_port}`
    }
  }
//   let local_mode = {
//   "host": "localhost"
//   },
//   "remote_mode" : {
//   "host": "192.168.0.103"
//   },
//   "frontend_port" : "4200",
//   "backend_port" : "5000",
//   "using_ssl" : true
// }
