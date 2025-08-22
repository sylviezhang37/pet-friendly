declare module "@atomiclotus/random-name-generator" {
  interface RandomNameGenerator {
    get(): string;
    getColor(): string;
    getAdjective(): string;
    getDescriptor(): string;
    getAnimal(): string;
  }

  const randomNameGenerator: RandomNameGenerator;
  export default randomNameGenerator;
}
