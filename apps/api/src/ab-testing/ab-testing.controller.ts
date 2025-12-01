import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ABTestingService } from './ab-testing.service';
import { CreateVariantDto, UpdateTrafficSplitDto, DeclareWinnerDto } from '../templates/dto/ab-testing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Roles } from '../auth/roles.decorator';
import { Scopes } from '../auth/scopes.decorator';
import { Role } from '@prisma/client';

@Controller('ab-testing')
export class ABTestingController {
    constructor(private readonly abTestingService: ABTestingService) { }

    @Post('templates/:id/variants')
    @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    createVariant(@Param('id') templateId: string, @Body() createVariantDto: CreateVariantDto) {
        return this.abTestingService.createVariant(templateId, createVariantDto);
    }

    @Get('templates/:id/variants')
    @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    getVariants(@Param('id') templateId: string) {
        return this.abTestingService.getVariants(templateId);
    }

    @Patch('variants/:id/traffic-split')
    @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    updateTrafficSplit(
        @Param('id') versionId: string,
        @Body() updateTrafficSplitDto: UpdateTrafficSplitDto,
    ) {
        return this.abTestingService.updateTrafficSplit(versionId, updateTrafficSplitDto.trafficSplit);
    }

    @Get('templates/:id/results')
    @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
    @Roles(Role.ADMIN, Role.OPERATOR, Role.VIEWER)
    @Scopes('read_templates')
    getABTestResults(@Param('id') templateId: string) {
        return this.abTestingService.getABTestResults(templateId);
    }

    @Post('templates/:id/declare-winner')
    @UseGuards(JwtAuthGuard, RolesGuard, ApiKeyGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Scopes('write_templates')
    declareWinner(@Param('id') templateId: string, @Body() declareWinnerDto: DeclareWinnerDto) {
        return this.abTestingService.declareWinner(templateId, declareWinnerDto.winnerVersionId);
    }

    @Post('track/:versionId/:event')
    // Public endpoint for tracking
    trackEvent(@Param('versionId') versionId: string, @Param('event') event: string) {
        return this.abTestingService.recordEvent(versionId, event as any);
    }
}
