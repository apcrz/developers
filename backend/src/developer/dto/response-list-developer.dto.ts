import { PartialType } from "@nestjs/mapped-types";
import { ResponseDeveloperDto } from "./response-developer.dto";

export class ResponseListDeveloperDto extends PartialType(ResponseDeveloperDto) {}