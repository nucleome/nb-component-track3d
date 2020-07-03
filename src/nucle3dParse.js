/* input is nucle3d text string
 * output is a 3dMol
 */
import nucle3d from "./structs/nucle3d"
export default function(d) {
     var n3d = nucle3d().read(d) //TODO
     return n3d
}
