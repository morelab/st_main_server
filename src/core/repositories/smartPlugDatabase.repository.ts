/** @format */

export default interface smartPlugDatabaseRepository {
  getSmartPlugUserIdById(id: string): Promise<string>;
}
