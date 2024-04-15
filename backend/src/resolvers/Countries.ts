import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Country, CountryCreateInput } from "../entities/Country";
import { validate } from "class-validator";

@Resolver(Country)
export class CountryResolver {
  @Query(() => [Country])
  async allCountries(): Promise<Country[]> {
    const countries = await Country.find();
    return countries;
  }

  @Query(() => Country, { nullable: true })
  async countryByCode(@Arg("code") code: string): Promise<Country> {
    const country = await Country.findOne({
      where: { code },
    });
    if (!country) {
      throw new Error(`Aucun pays trouvé pour le code : ${code}`);
    }
    return country;
  }

  @Query(() => [Country], { nullable: true })
  async countriesByContinent(
    @Arg("continentCode") continentCode: string
  ): Promise<Country[]> {
    const countries = await Country.find({
      where: { continentCode },
    });
    if (!countries || countries.length === 0) {
      throw new Error(
        `Aucun pays trouvé pour le code de continent : ${continentCode}`
      );
    }
    return countries;
  }

  @Mutation(() => Country)
  async createCountry(
    @Arg("code") code: string,
    @Arg("name") name: string,
    @Arg("emoji") emoji: string,
    @Arg("continentCode") continentCode: string
  ): Promise<Country> {
    const newCountry = Country.create({ code, name, emoji, continentCode });

    const errors = await validate(newCountry);

    if (errors.length === 0) {
      await newCountry.save();
      return newCountry;
    } else {
      throw new Error(`Validation failed!`);
    }
  }

  // @Mutation(() => Country)
  // async createCountry(
  //   @Arg("data", () => CountryCreateInput) data: CountryCreateInput
  // ): Promise<Country> {
  //   const newCountry = new Country();

  //   Object.assign(newCountry, data);

  //   const errors = await validate(newCountry);

  //   if (errors.length === 0) {
  //     await newCountry.save();
  //     return newCountry;
  //   } else {
  //     throw new Error(`Validation failed!`);
  //   }
  // }
}
