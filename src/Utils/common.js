export default class Utils {
  static cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
  }
}