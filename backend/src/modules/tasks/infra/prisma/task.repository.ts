import prisma from "../../../../lib/prisma";
import type { Task } from "@prisma/client";
import { AuthRepository } from "../../../auth/domain/repositories";

export class PrismaAuthRepository implements AuthRepository{

};