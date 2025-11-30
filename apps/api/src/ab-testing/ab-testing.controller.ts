import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ABTestingService } from './ab-testing.service';
import { CreateVariantDto, UpdateTrafficSplitDto, DeclareWinnerDto } from '../templates/dto/ab-testing.dto';

@Controller('ab-testing')
export class ABTestingController {
    constructor(private readonly abTestingService: ABTestingService) { }

    @Post('templates/:id/variants')
    createVariant(@Param('id') templateId: string, @Body() createVariantDto: CreateVariantDto) {
        return this.abTestingService.createVariant(templateId, createVariantDto);
    }

    @Get('templates/:id/variants')
    getVariants(@Param('id') templateId: string) {
        return this.abTestingService.getVariants(templateId);
    }

    @Patch('variants/:id/traffic-split')
    updateTrafficSplit(
        @Param('id') versionId: string,
        @Body() updateTrafficSplitDto: UpdateTrafficSplitDto,
    ) {
        return this.abTestingService.updateTrafficSplit(versionId, updateTrafficSplitDto.trafficSplit);
    }

    @Get('templates/:id/results')
    getABTestResults(@Param('id') templateId: string) {
        return this.abTestingService.getABTestResults(templateId);
    }

    @Post('templates/:id/declare-winner')
    declareWinner(@Param('id') templateId: string, @Body() declareWinnerDto: DeclareWinnerDto) {
        return this.abTestingService.declareWinner(templateId, declareWinnerDto.winnerVersionId);
    }

    @Post('track/:versionId/:event')
    trackEvent(@Param('versionId') versionId: string, @Param('event') event: string) {
        return this.abTestingService.recordEvent(versionId, event as any);
    }
}
