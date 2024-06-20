export * from './banner.service';
import { BannerService } from './banner.service';
export * from './cgmImport.service';
import { CgmImportService } from './cgmImport.service';
export * from './meals.service';
import { MealsService } from './meals.service';
export * from './products.service';
import { ProductsService } from './products.service';
export const APIS = [BannerService, CgmImportService, MealsService, ProductsService];
