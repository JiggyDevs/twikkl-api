import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { FollowingService } from "./following.service";
import { StrictAuthGuard } from "src/middleware-guards/auth-guard.middleware";
import { Request, Response } from "express";
import { FollowUserDto, UnFollowUserDto } from "./dto/followerUser.dto";
import { FindByUserIdDto, IFollowAUser, IGetAllFollowers, IUnFollowUser } from "./following.type";

@Controller('/following')
export class FollowingController {
    constructor(
        private service: FollowingService
    )
    {}

    @Post('/follow')
    @UseGuards(StrictAuthGuard)
    async followUser(@Req() req: Request, @Res() res: Response, @Body() body: FollowUserDto) {
        const userId = req.user._id
        const payload: IFollowAUser = { userId, ...body }

        const response = await this.service.followAUser(payload)
        return res.status(response.status).json(response)
    }

    @Delete('/unfollow')
    @UseGuards(StrictAuthGuard)
    async unFollowUser(@Req() req: Request, @Res() res: Response, @Body() body: UnFollowUserDto) {
        const userId = req.user._id
        const payload: IUnFollowUser = { userId, ...body }

        const response = await this.service.unFollowUser(payload)
        return res.status(response.status).json(response)
    }

    @Get('/followers/:userId')
    @UseGuards(StrictAuthGuard)
    async getAllFollowers(@Res() res: Response, @Query() query: any, @Param() params: FindByUserIdDto) {
        const { userId } = params
        query = { user: userId }
        const payload: IGetAllFollowers = { ...query }

        const response = await this.service.getAllFollowers(payload)
        return res.status(response.status).json(response)
    }

    @Get('/')
    @UseGuards(StrictAuthGuard)
    async getAllFollowing(@Req() req: Request, @Res() res: Response, @Query() query: any) {
        const userId = req.user._id
        query = { follower: userId }
        const payload: IGetAllFollowers = { ...query }

        const response = await this.service.getAllFollowers(payload)
        return res.status(response.status).json(response)
    }
}