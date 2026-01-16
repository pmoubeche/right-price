export class StringUtils {
  public static replaceSpacesByDash(str: string): string {
    return str.replace(/\s+/g, '-');
  }
}
