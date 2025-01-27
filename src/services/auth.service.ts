import { Request } from "express";
import { prisma } from "../config";
import { hashPassword } from "../helpers/bcrypt";

class AuthService {
  async signIn(req: Request) {
    const { email, password } = req.body;
    return await prisma.user.findUnique({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        role: true,
        img_src: true,
      },
      where: {
        email,
        password,
      },
    });
  }

  async signUp(req: Request) {
    const {
      email,
      password,
      full_name,
      role,
      username,
      phone_number,
      referral_code,
    } = req.body;

    const hashedPassword = await hashPassword(password);
    console.log(email, password, full_name, role, username, phone_number);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        role,
        username,
        phone_number,
        referral_code,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async updateUser(req: Request) {
    const { password, first_name, last_name, img_src } = req.body;
    const id = Number(req.params.id);
    const data: Prisma.UserUpdateInput = {};
    if (img_src) data.img_src = img_src;
    if (password) data.password = password;
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;

    await prisma.user.update({
      data,
      where: {
        id,
      },
    });
    return await prisma.user.findUnique({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        role: true,
        img_src: true,
      },
      where: {
        id,
      },
    });
  }
}

export default new AuthService();
