/** @format */

export default interface consumptionEquivalenceRepository {
  getSmartPlugConsumptionEquivalence(location: string): Promise<string>;
}
