export class ErrorHelper {
  static unimplementedError(methodName) {
    if (!(methodName instanceof String)) this.typeError("methodName", "string");
    throw new Error(methodName + "is not implemented");
  }

  static typeError(paramName, typeName) {
    if (!(paramName instanceof String)) this.typeError("paramName", "string");
    if (!(typeName instanceof String)) this.typeError("typename", "string");
    throw new Error(`Parametar ${paramName} must be ${typeName}`);
  }

  static async fetchingErrorCheck(
    fetchedObjectOrResponse,
    callbackIfOk,
    callbackIfNotOk
  ) {
    if (fetchedObjectOrResponse === null || fetchedObjectOrResponse === false) {
      alert("Fetching error!");
      if (callbackIfNotOk != null) await callbackIfNotOk();
      return;
    }
    if (callbackIfOk != null) await callbackIfOk();
  }
}
