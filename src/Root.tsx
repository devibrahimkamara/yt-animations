import { MontageAisa, FULL_DURATION } from "./MontageAisa/Full";
import { IdentiteV2Board } from "./identiteV2/Board";
import { MontageAisaHook, HOOK_END } from "./MontageAisa/Hook";
import { MontageMinimax, MONTAGE_MINIMAX_FRAMES } from "./MontageMinimax";
import "./index.css";
import { Composition } from "remotion";
import { PartProgress, partProgressSchema } from "./PartProgress";
import { DarkGridTitleCard, darkGridTitleCardSchema } from "./DarkGridTitleCard";
import { GlassMotionCard, glassMotionCardSchema } from "./GlassMotionCard";
import { TypewriterCard, typewriterCardSchema } from "./TypewriterCard";
import { FlowDiagram, flowDiagramSchema } from "./FlowDiagram";
import { KineticTypography, kineticTypographySchema } from "./KineticTypography";
import { WaveformVisualizer, waveformVisualizerSchema } from "./WaveformVisualizer";
import { SplitScreen, splitScreenSchema } from "./SplitScreen";
import { TimelineCard, timelineCardSchema } from "./TimelineCard";
import { StarReviews, starReviewsSchema } from "./StarReviews";
import { ToggleCard, toggleCardSchema } from "./ToggleCard";
import { KaraokeCard, karaokeCardSchema } from "./KaraokeCard";
import { MapCard, mapCardSchema } from "./MapCard";
import { MusicVsAI, musicVsAISchema } from "./MusicVsAI";
import { SkillMeter, skillMeterSchema } from "./SkillMeter";
import { MysteryChecklist, mysteryChecklistSchema } from "./MysteryChecklist";
import { ScreenHighlight, screenHighlightSchema } from "./ScreenHighlight";
import { CascadeText, cascadeTextSchema } from "./CascadeText";
import { StatusTransition, statusTransitionSchema } from "./StatusTransition";
import { IconPair, iconPairSchema } from "./IconPair";
import { CTACard, ctaCardSchema } from "./CTACard";
import { IcebergReveal, icebergRevealSchema } from "./IcebergReveal";
import { LevelComparison, levelComparisonSchema } from "./LevelComparison";
// ── NOUVELLES ANIMATIONS (instructions.rtf)
import { Anim02Iceberg, anim02Schema } from "./Anim02Iceberg";
import { Anim03Timeline, anim03Schema } from "./Anim03Timeline";
import { Anim04TrendGraph, anim04Schema } from "./Anim04TrendGraph";
import { Anim05MindMap, anim05Schema } from "./Anim05MindMap";
import { Anim06Partnerships, anim06Schema } from "./Anim06Partnerships";
import { Anim07ExpenseCounter, anim07Schema } from "./Anim07ExpenseCounter";
import { Anim08Flowchart, anim08Schema } from "./Anim08Flowchart";
import { Anim09EmailHandoff, anim09Schema } from "./Anim09EmailHandoff";
import { Anim10Vault, anim10Schema } from "./Anim10Vault";
import { Anim11Checklist, anim11Schema } from "./Anim11Checklist";
// ── VIDÉO IA PROSPECTION — 26 animations
import { IcebergSplit, icebergSplitSchema } from "./IcebergSplit";
import { LevelUpCard, levelUpCardSchema } from "./LevelUpCard";
import { AutopilotDashboard, autopilotDashboardSchema } from "./AutopilotDashboard";
import { ComparisonColumns, comparisonColumnsSchema } from "./ComparisonColumns";
import { OrgChartChaos, orgChartChaosSchema } from "./OrgChartChaos";
import { LegoBlocks, legoBlocksSchema } from "./LegoBlocks";
import { MysteryVault, mysteryVaultSchema } from "./MysteryVault";
import { VideoWall, videoWallSchema } from "./VideoWall";
import { DecisionTreeCard, decisionTreeCardSchema } from "./DecisionTreeCard";
import { MoneyFlow, moneyFlowSchema } from "./MoneyFlow";
import { ManualWorkMontage, manualWorkMontageSchema } from "./ManualWorkMontage";
import { SaaSMockup, saasMockupSchema } from "./SaaSMockup";
import { MoneyCounter, moneyCounterSchema } from "./MoneyCounter";
import { AIRobotIntro, aiRobotIntroSchema } from "./AIRobotIntro";
import { WorldMapScan, worldMapScanSchema } from "./WorldMapScan";
import { GmailTypewriter, gmailTypewriterSchema } from "./GmailTypewriter";
import { EmailBlast, emailBlastSchema } from "./EmailBlast";
import { InboxNotifications, inboxNotificationsSchema } from "./InboxNotifications";
import { ManualApproval, manualApprovalSchema } from "./ManualApproval";
import { FullWorkflowZoom, fullWorkflowZoomSchema } from "./FullWorkflowZoom";
import { DoubleGraph, doubleGraphSchema } from "./DoubleGraph";
import { BlurredReveal, blurredRevealSchema } from "./BlurredReveal";
// ── VIDÉO TEEM DROP — animation 1
import { TeemDrop, teemDropSchema } from "./TeemDrop";
// ── VIDÉO TEEM DROP — animation 2
import { TeemDrop02, teemDrop02Schema } from "./TeemDrop02";
// ── VIDÉO TEEM DROP — animation 3
import { TeemDrop03, teemDrop03Schema } from "./TeemDrop03";
// ── VIDÉO TEEM DROP — animations 4–9
import { TeemDrop04, teemDrop04Schema } from "./TeemDrop04";
import { TeemDrop05, teemDrop05Schema } from "./TeemDrop05";
import { TeemDrop06, teemDrop06Schema } from "./TeemDrop06";
import { TeemDrop07, teemDrop07Schema } from "./TeemDrop07";
import { TeemDrop08, teemDrop08Schema } from "./TeemDrop08";
import {
  TeemDrop09Step1, teemDrop09Step1Schema,
  TeemDrop09Step2, teemDrop09Step2Schema,
  TeemDrop09Step3, teemDrop09Step3Schema,
  TeemDrop09Step4, teemDrop09Step4Schema,
  TeemDrop09Step5, teemDrop09Step5Schema,
} from "./TeemDrop09";
// ── VIDÉO TEEM DROP — animations 10–14
import { TeemDrop10, teemDrop10Schema } from "./TeemDrop10";
import { TeemDrop11, teemDrop11Schema } from "./TeemDrop11";
import { TeemDrop12, teemDrop12Schema } from "./TeemDrop12";
import { TeemDrop13, teemDrop13Schema } from "./TeemDrop13";
import { TeemDrop14, teemDrop14Schema } from "./TeemDrop14";
// ── VIDÉO ATMOS — 8 animations
import { AtmosAnim01HateScene, atmosAnim01Schema } from "./AtmosAnim01HateScene";
// ── VIDÉO HIGGSFIELD — 8 animations
import { HighsfieldAnim01MoneyCounter, highsfieldAnim01Schema } from "./HighsfieldAnim01MoneyCounter";
import { HighsfieldAnim02UpworkAvatars, highsfieldAnim02Schema } from "./HighsfieldAnim02UpworkAvatars";
import { HighsfieldAnim03Timeline, highsfieldAnim03Schema } from "./HighsfieldAnim03Timeline";
import { HighsfieldAnim04Dissolution, highsfieldAnim04Schema } from "./HighsfieldAnim04Dissolution";
import { HighsfieldAnim05SplitScreen, highsfieldAnim05Schema } from "./HighsfieldAnim05SplitScreen";
import { HighsfieldAnim06DesignersList, highsfieldAnim06Schema } from "./HighsfieldAnim06DesignersList";
import { HighsfieldAnim07StampBadge, highsfieldAnim07Schema } from "./HighsfieldAnim07StampBadge";
import { HighsfieldAnim08CostCurve, highsfieldAnim08Schema } from "./HighsfieldAnim08CostCurve";
import { AtmosAnim02RevenueCounter, atmosAnim02Schema } from "./AtmosAnim02RevenueCounter";
import { AtmosAnim03CredibilityTimeline, atmosAnim03Schema } from "./AtmosAnim03CredibilityTimeline";
import { AtmosAnim04GeneralistTrap, atmosAnim04Schema } from "./AtmosAnim04GeneralistTrap";
import { AtmosAnim05NicheZoom, atmosAnim05Schema } from "./AtmosAnim05NicheZoom";
import { AtmosAnim06SageVsApp, atmosAnim06Schema } from "./AtmosAnim06SageVsApp";
import { AtmosAnim07NicheCards, atmosAnim07Schema } from "./AtmosAnim07NicheCards";
import { AtmosAnim08AIBuilder, atmosAnim08Schema } from "./AtmosAnim08AIBuilder";
// ── VIDÉO ATMOS 2 — 10 ANIMATIONS OVERLAY (transparentes, par-dessus la face cam)
import { AtmosAnim09QuestionMorph, atmosAnim09Schema } from "./AtmosAnim09QuestionMorph";
import { AtmosAnim10AccessibilityBurst, atmosAnim10Schema } from "./AtmosAnim10AccessibilityBurst";
import { AtmosAnim11IdeaMountain, atmosAnim11Schema } from "./AtmosAnim11IdeaMountain";
import { AtmosAnim12Counter47, atmosAnim12Schema } from "./AtmosAnim12Counter47";
import { AtmosAnim13SelectionFunnel, atmosAnim13Schema } from "./AtmosAnim13SelectionFunnel";
import { AtmosAnim14LowerThird, atmosAnim14Schema } from "./AtmosAnim14LowerThird";
import { AtmosAnim15CTASubscribe, atmosAnim15Schema } from "./AtmosAnim15CTASubscribe";
import { AtmosAnim16TripleStrike, atmosAnim16Schema } from "./AtmosAnim16TripleStrike";
import { AtmosAnim17KeywordIsolate, atmosAnim17Schema } from "./AtmosAnim17KeywordIsolate";
import { AtmosAnim18ProofStamp, atmosAnim18Schema } from "./AtmosAnim18ProofStamp";
// ── VIDÉO GENSPARK — 4 animations
import { GenSparkAnim01SoftwareChaos } from "./GenSparkAnim01SoftwareChaos";
import { GenSparkAnim02Convergence } from "./GenSparkAnim02Convergence";
import { GenSparkAnim03Stats } from "./GenSparkAnim03Stats";
import { GenSparkAnim04Comparison } from "./GenSparkAnim04Comparison";
// ── VIDÉO GENSPARK NEW — 10 animations
import { GenSparkAnim05ChaosToClarity } from "./GenSparkAnim05ChaosToClarity";
import { GenSparkAnim06KineticType } from "./GenSparkAnim06KineticType";
import { GenSparkAnim07RoadmapTeaser } from "./GenSparkAnim07RoadmapTeaser";
import { GenSparkAnim08LowerThird } from "./GenSparkAnim08LowerThird";
import { GenSparkAnim09CTASubscribe } from "./GenSparkAnim09CTASubscribe";
import { GenSparkAnim10LogoReveal } from "./GenSparkAnim10LogoReveal";
import { GenSparkAnim11RadialDiagram } from "./GenSparkAnim11RadialDiagram";
import { GenSparkAnim12Counter250M } from "./GenSparkAnim12Counter250M";
import { GenSparkAnim13ComparisonRace } from "./GenSparkAnim13ComparisonRace";
import { GenSparkAnim14ChapterCard } from "./GenSparkAnim14ChapterCard";
// ── VIDÉO RECOVERIT — 10 animations
import { RecoverItAnim01, recoverItAnim01Schema } from "./RecoverItAnim01";
import { RecoverItAnim02, recoverItAnim02Schema } from "./RecoverItAnim02";
import { RecoverItAnim03, recoverItAnim03Schema } from "./RecoverItAnim03";
import { RecoverItAnim04, recoverItAnim04Schema } from "./RecoverItAnim04";
import { RecoverItAnim05, recoverItAnim05Schema } from "./RecoverItAnim05";
import { RecoverItAnim06, recoverItAnim06Schema } from "./RecoverItAnim06";
import { RecoverItAnim07, recoverItAnim07Schema } from "./RecoverItAnim07";
import { RecoverItAnim08, recoverItAnim08Schema } from "./RecoverItAnim08";
import { RecoverItAnim09, recoverItAnim09Schema } from "./RecoverItAnim09";
import { RecoverItAnim10, recoverItAnim10Schema } from "./RecoverItAnim10";
// ── VIDÉO HIGGS2 — 10 animations (chaîne YouTube 100 % IA)
import { Higgs2Anim01FriseVieChaine, higgs2Anim01Schema } from "./Higgs2Anim01FriseVieChaine";
import { Higgs2Anim02ChaineProductionIA, higgs2Anim02Schema } from "./Higgs2Anim02ChaineProductionIA";
import { Higgs2Anim03Split2020vs2026, higgs2Anim03Schema } from "./Higgs2Anim03Split2020vs2026";
import { Higgs2Anim04CTAAbonnementCompteur, higgs2Anim04Schema } from "./Higgs2Anim04CTAAbonnementCompteur";
import { Higgs2Anim05PodiumPlateformes, higgs2Anim05Schema } from "./Higgs2Anim05PodiumPlateformes";
import { Higgs2Anim06AnatomieRevenuPub, higgs2Anim06Schema } from "./Higgs2Anim06AnatomieRevenuPub";
import { Higgs2Anim07PaliersRevenus, higgs2Anim07Schema } from "./Higgs2Anim07PaliersRevenus";
import { Higgs2Anim08DissolutionVisage, higgs2Anim08Schema } from "./Higgs2Anim08DissolutionVisage";
import { Higgs2Anim09CerveauEtMembres, higgs2Anim09Schema } from "./Higgs2Anim09CerveauEtMembres";
import { Higgs2Anim10ClaudeVsChatGPT, higgs2Anim10Schema } from "./Higgs2Anim10ClaudeVsChatGPT";
// ── VIDÉO FREEBEAT — 7 animations (clips musicaux 100 % IA)
import { FreebeatAnim01MasqueTypo2026, freebeatAnim01Schema } from "./FreebeatAnim01MasqueTypo2026";
import { FreebeatAnim02OdometreTarif, freebeatAnim02Schema } from "./FreebeatAnim02OdometreTarif";
import { FreebeatAnim03RechercheVide, freebeatAnim03Schema } from "./FreebeatAnim03RechercheVide";
import { FreebeatAnim04DelugeSorties, freebeatAnim04Schema } from "./FreebeatAnim04DelugeSorties";
import { FreebeatAnim05MurBudget, freebeatAnim05Schema } from "./FreebeatAnim05MurBudget";
import { FreebeatAnim06ChaineProduction, freebeatAnim06Schema } from "./FreebeatAnim06ChaineProduction";
import { FreebeatAnim07WipeAvantApres, freebeatAnim07Schema } from "./FreebeatAnim07WipeAvantApres";
// ── VIDÉO HIGGS — 9 animations (influenceur IA)
import { HiggsAnim01DesintegrationPixels, higgsAnim01Schema } from "./HiggsAnim01DesintegrationPixels";
import { HiggsAnim02Compteur40Minutes, higgsAnim02Schema } from "./HiggsAnim02Compteur40Minutes";
import { HiggsAnim03RailAtoZ, higgsAnim03Schema } from "./HiggsAnim03RailAtoZ";
import { HiggsAnim04WipeDiagonal, higgsAnim04Schema } from "./HiggsAnim04WipeDiagonal";
import { HiggsAnim05LigneTemps2020, higgsAnim05Schema } from "./HiggsAnim05LigneTemps2020";
import { HiggsAnim06BarreAbonnement, higgsAnim06Schema } from "./HiggsAnim06BarreAbonnement";
import { HiggsAnim07TuyauxRevenus, higgsAnim07Schema } from "./HiggsAnim07TuyauxRevenus";
import { HiggsAnim08MurDeVerre, higgsAnim08Schema } from "./HiggsAnim08MurDeVerre";
import { HiggsAnim09MasqueRevelateur, higgsAnim09Schema } from "./HiggsAnim09MasqueRevelateur";
// ── VIDÉO HIGGS ADOBE — 10 animations (l'IA + Premiere Pro remplacent le monteur)
import { HiggsAdobeAnim01Courbe3Ans, higgsAdobeAnim01Schema } from "./HiggsAdobeAnim01Courbe3Ans";
import { HiggsAdobeAnim02QuestionsConvergent, higgsAdobeAnim02Schema } from "./HiggsAdobeAnim02QuestionsConvergent";
import { HiggsAdobeAnim03TimelineRemplissage, higgsAdobeAnim03Schema } from "./HiggsAdobeAnim03TimelineRemplissage";
import { HiggsAdobeAnim04MosaiqueScan, higgsAdobeAnim04Schema } from "./HiggsAdobeAnim04MosaiqueScan";
import { HiggsAdobeAnim05Cassure, higgsAdobeAnim05Schema } from "./HiggsAdobeAnim05Cassure";
import { HiggsAdobeAnim06AvantMaintenant, higgsAdobeAnim06Schema } from "./HiggsAdobeAnim06AvantMaintenant";
import { HiggsAdobeAnim07DeuxProfils, higgsAdobeAnim07Schema } from "./HiggsAdobeAnim07DeuxProfils";
import { HiggsAdobeAnim08BarreProgression, higgsAdobeAnim08Schema } from "./HiggsAdobeAnim08BarreProgression";
import { HiggsAdobeAnim09StackAssemblage, higgsAdobeAnim09Schema } from "./HiggsAdobeAnim09StackAssemblage";
import { HiggsAdobeAnim10TamponReference, higgsAdobeAnim10Schema } from "./HiggsAdobeAnim10TamponReference";

// ── VIDÉO PDFELEMENT — 10 animations (analyser un contrat avec l'IA — PDFelement v13)
import { PdfelementAnim01ScanContratHook, pdfelementAnim01Schema } from "./PdfelementAnim01ScanContratHook";
import { PdfelementAnim02LoupePetitsCaracteres, pdfelementAnim02Schema } from "./PdfelementAnim02LoupePetitsCaracteres";
import { PdfelementAnim03CourseIAVsManuel, pdfelementAnim03Schema } from "./PdfelementAnim03CourseIAVsManuel";
import { PdfelementAnim04UpgradeVersion13Badge, pdfelementAnim04Schema } from "./PdfelementAnim04UpgradeVersion13Badge";
import { PdfelementAnim05QuatreProfilsGrid, pdfelementAnim05Schema } from "./PdfelementAnim05QuatreProfilsGrid";
import { PdfelementAnim06CarrouselContratsPerspective, pdfelementAnim06Schema } from "./PdfelementAnim06CarrouselContratsPerspective";
import { PdfelementAnim07BarreOutilsAllumage, pdfelementAnim07Schema } from "./PdfelementAnim07BarreOutilsAllumage";
import { PdfelementAnim08RadarDetectionIA, pdfelementAnim08Schema } from "./PdfelementAnim08RadarDetectionIA";
import { PdfelementAnim09DisclaimerAvocat, pdfelementAnim09Schema } from "./PdfelementAnim09DisclaimerAvocat";
import { PdfelementAnim10TransitionTutoriel, pdfelementAnim10Schema } from "./PdfelementAnim10TransitionTutoriel";

// ── VIDÉO MAXDROP — 17 animations (marché des compléments alimentaires / marque blanche — sponsor Max Dropshipping)
import { MaxdropAnim01CompteurEchelle, maxdropAnim01Schema } from "./MaxdropAnim01CompteurEchelle";
import { MaxdropAnim02Duel2018vs2025, maxdropAnim02Schema } from "./MaxdropAnim02Duel2018vs2025";
import { MaxdropAnim03EliminationSuspects, maxdropAnim03Schema } from "./MaxdropAnim03EliminationSuspects";
import { MaxdropAnim04BoucleRachat, maxdropAnim04Schema } from "./MaxdropAnim04BoucleRachat";
import { MaxdropAnim05TroisSans, maxdropAnim05Schema } from "./MaxdropAnim05TroisSans";
import { MaxdropAnim06ConstructionBouteille, maxdropAnim06Schema } from "./MaxdropAnim06ConstructionBouteille";
import { MaxdropAnim07CourbeDecolle, maxdropAnim07Schema } from "./MaxdropAnim07CourbeDecolle";
import { MaxdropAnim08CausesSobre, maxdropAnim08Schema } from "./MaxdropAnim08CausesSobre";
import { MaxdropAnim09MurDevientFosse, maxdropAnim09Schema } from "./MaxdropAnim09MurDevientFosse";
import { MaxdropAnim10MecaniqueMarqueBlanche, maxdropAnim10Schema } from "./MaxdropAnim10MecaniqueMarqueBlanche";
import { MaxdropAnim11PartageDesTaches, maxdropAnim11Schema } from "./MaxdropAnim11PartageDesTaches";
import { MaxdropAnim12ReseauMondial, maxdropAnim12Schema } from "./MaxdropAnim12ReseauMondial";
import { MaxdropAnim13Timeline10Jours, maxdropAnim13Schema } from "./MaxdropAnim13Timeline10Jours";
import { MaxdropAnim14ChuteDuMOQ, maxdropAnim14Schema } from "./MaxdropAnim14ChuteDuMOQ";
import { MaxdropAnim15LaboFormulation, maxdropAnim15Schema } from "./MaxdropAnim15LaboFormulation";
import { MaxdropAnim16CarrouselFormats, maxdropAnim16Schema } from "./MaxdropAnim16CarrouselFormats";
import { MaxdropAnim17CTAFinal, maxdropAnim17Schema } from "./MaxdropAnim17CTAFinal";

// ── VIDÉO HIGGS BLEN — 8 animations (apprendre Blender avec l'IA)
import { HiggsBlenAnim01MurRendus, higgsBlenAnim01Schema } from "./HiggsBlenAnim01MurRendus";
import { HiggsBlenAnim02FicheVide, higgsBlenAnim02Schema } from "./HiggsBlenAnim02FicheVide";
import { HiggsBlenAnim03ChaosRange, higgsBlenAnim03Schema } from "./HiggsBlenAnim03ChaosRange";
import { HiggsBlenAnim04Odometre, higgsBlenAnim04Schema } from "./HiggsBlenAnim04Odometre";
import { HiggsBlenAnim05Constellation, higgsBlenAnim05Schema } from "./HiggsBlenAnim05Constellation";
import { HiggsBlenAnim06DeuxCourbes, higgsBlenAnim06Schema } from "./HiggsBlenAnim06DeuxCourbes";
import { HiggsBlenAnim07CarteIdentite, higgsBlenAnim07Schema } from "./HiggsBlenAnim07CarteIdentite";
import { HiggsBlenAnim08BandeauUnivers, higgsBlenAnim08Schema } from "./HiggsBlenAnim08BandeauUnivers";

// ── VIDÉO HIGGS GPT — 8 animations (GPT-6 Astra + l'outil mystère)
import { HiggsGptAnim01Rembobinage, higgsGptAnim01Schema } from "./HiggsGptAnim01Rembobinage";
import { HiggsGptAnim02EquationIncomplete, higgsGptAnim02Schema } from "./HiggsGptAnim02EquationIncomplete";
import { HiggsGptAnim03TroisVerrous, higgsGptAnim03Schema } from "./HiggsGptAnim03TroisVerrous";
import { HiggsGptAnim04RampeDates, higgsGptAnim04Schema } from "./HiggsGptAnim04RampeDates";
import { HiggsGptAnim05MurSuperlatifs, higgsGptAnim05Schema } from "./HiggsGptAnim05MurSuperlatifs";
import { HiggsGptAnim06CarteAbonnement, higgsGptAnim06Schema } from "./HiggsGptAnim06CarteAbonnement";
import { HiggsGptAnim07BazookaCrepe, higgsGptAnim07Schema } from "./HiggsGptAnim07BazookaCrepe";
import { HiggsGptAnim08PlafondVerre, higgsGptAnim08Schema } from "./HiggsGptAnim08PlafondVerre";

// ── VIDÉO HIGGS GPT 6 · 2 — 9 animations (Astra construit une chaîne YouTube)
import { HiggsGpt2Anim01ChaineQuiSeConstruit, higgsGpt2Anim01Schema } from "./HiggsGpt2Anim01ChaineQuiSeConstruit";
import { HiggsGpt2Anim02ChaineProduction3Maillons, higgsGpt2Anim02Schema } from "./HiggsGpt2Anim02ChaineProduction3Maillons";
import { HiggsGpt2Anim03CompteurEffortZero, higgsGpt2Anim03Schema } from "./HiggsGpt2Anim03CompteurEffortZero";
import { HiggsGpt2Anim04BarreProgressionChapitres, higgsGpt2Anim04Schema } from "./HiggsGpt2Anim04BarreProgressionChapitres";
import { HiggsGpt2Anim05CarteAbonnementFlip, higgsGpt2Anim05Schema } from "./HiggsGpt2Anim05CarteAbonnementFlip";
import { HiggsGpt2Anim06DeverrouillageModele, higgsGpt2Anim06Schema } from "./HiggsGpt2Anim06DeverrouillageModele";
import { HiggsGpt2Anim07ModuleClipse, higgsGpt2Anim07Schema } from "./HiggsGpt2Anim07ModuleClipse";
import { HiggsGpt2Anim08MosaiqueCapacites, higgsGpt2Anim08Schema } from "./HiggsGpt2Anim08MosaiqueCapacites";
import { HiggsGpt2Anim09FlecheDescription, higgsGpt2Anim09Schema } from "./HiggsGpt2Anim09FlecheDescription";

// ── VIDÉO HIGGS GPT 6 · 3 — 7 animations (maison IA + méthode immobilier 2026)
import { HiggsGpt3Anim01ScanMetadonnees, higgsGpt3Anim01Schema } from "./HiggsGpt3Anim01ScanMetadonnees";
import { HiggsGpt3Anim02RailAZ, higgsGpt3Anim02Schema } from "./HiggsGpt3Anim02RailAZ";
import { HiggsGpt3Anim03DoubleColonneBudget, higgsGpt3Anim03Schema } from "./HiggsGpt3Anim03DoubleColonneBudget";
import { HiggsGpt3Anim04CarteIdentite, higgsGpt3Anim04Schema } from "./HiggsGpt3Anim04CarteIdentite";
import { HiggsGpt3Anim05MosaiqueMiniatures, higgsGpt3Anim05Schema } from "./HiggsGpt3Anim05MosaiqueMiniatures";
import { HiggsGpt3Anim06JaugeAbonnement, higgsGpt3Anim06Schema } from "./HiggsGpt3Anim06JaugeAbonnement";
import { HiggsGpt3Anim07AssemblagePipeline, higgsGpt3Anim07Schema } from "./HiggsGpt3Anim07AssemblagePipeline";

// ── VIDÉO HIGGS AFTER — 9 animations (IA + After Effects)
import { HiggsAfterAnim01SplitEchec, higgsAfterAnim01Schema } from "./HiggsAfterAnim01SplitEchec";
import { HiggsAfterAnim02EquationIAAE, higgsAfterAnim02Schema } from "./HiggsAfterAnim02EquationIAAE";
import { HiggsAfterAnim03DeuxPiliers, higgsAfterAnim03Schema } from "./HiggsAfterAnim03DeuxPiliers";
import { HiggsAfterAnim04MosaiqueZoom, higgsAfterAnim04Schema } from "./HiggsAfterAnim04MosaiqueZoom";
import { HiggsAfterAnim05CourbeDifficulte, higgsAfterAnim05Schema } from "./HiggsAfterAnim05CourbeDifficulte";
import { HiggsAfterAnim06ChecklistFloutee, higgsAfterAnim06Schema } from "./HiggsAfterAnim06ChecklistFloutee";
import { HiggsAfterAnim07CarteAbonnementOdometre, higgsAfterAnim07Schema } from "./HiggsAfterAnim07CarteAbonnementOdometre";
import { HiggsAfterAnim08MorphFenetre, higgsAfterAnim08Schema } from "./HiggsAfterAnim08MorphFenetre";
import { HiggsAfterAnim09SchemaConnexion, higgsAfterAnim09Schema } from "./HiggsAfterAnim09SchemaConnexion";

// ── VIDÉO PIPPIT — 6 animations (affiliation via IA 100 % réaliste) ──
import { PippitAnim01FicheDictionnaire, pippitAnim01Schema } from "./PippitAnim01FicheDictionnaire";
import { PippitAnim02CircuitCommission, pippitAnim02Schema } from "./PippitAnim02CircuitCommission";
import { PippitAnim03TamponPasBesoin, pippitAnim03Schema } from "./PippitAnim03TamponPasBesoin";
import { PippitAnim04MorphingOrdiTelephone, pippitAnim04Schema } from "./PippitAnim04MorphingOrdiTelephone";
import { PippitAnim05DeflouCompteurZero, pippitAnim05Schema } from "./PippitAnim05DeflouCompteurZero";
import { PippitAnim06AbsorptionIA, pippitAnim06Schema } from "./PippitAnim06AbsorptionIA";
// ── VIDÉO HIGGS MARKETING — 10 animations
import { HiggsMarketingAnim01EtiquettePrix, higgsMarketingAnim01Schema } from "./HiggsMarketingAnim01EtiquettePrix";
import { HiggsMarketingAnim02CourbeSaison, higgsMarketingAnim02Schema } from "./HiggsMarketingAnim02CourbeSaison";
import { HiggsMarketingAnim03CircuitArgent, higgsMarketingAnim03Schema } from "./HiggsMarketingAnim03CircuitArgent";
import { HiggsMarketingAnim04MurOffres, higgsMarketingAnim04Schema } from "./HiggsMarketingAnim04MurOffres";
import { HiggsMarketingAnim05MachinePrenoms, higgsMarketingAnim05Schema } from "./HiggsMarketingAnim05MachinePrenoms";
import { HiggsMarketingAnim06ImplosionOutils, higgsMarketingAnim06Schema } from "./HiggsMarketingAnim06ImplosionOutils";
import { HiggsMarketingAnim07TerminalWhoami, higgsMarketingAnim07Schema } from "./HiggsMarketingAnim07TerminalWhoami";
import { HiggsMarketingAnim08BoutonPhysique, higgsMarketingAnim08Schema } from "./HiggsMarketingAnim08BoutonPhysique";
import { HiggsMarketingAnim09CadenasModele, higgsMarketingAnim09Schema } from "./HiggsMarketingAnim09CadenasModele";
import { HiggsMarketingAnim10BalanceRentabilite, higgsMarketingAnim10Schema } from "./HiggsMarketingAnim10BalanceRentabilite";
// ── VIDÉO HIGGS API — 9 animations
import { HiggsApiAnim01PlanArchitecte, higgsApiAnim01Schema } from "./HiggsApiAnim01PlanArchitecte";
import { HiggsApiAnim02ProliferationLogiciels, higgsApiAnim02Schema } from "./HiggsApiAnim02ProliferationLogiciels";
import { HiggsApiAnim03ReleveBancaire, higgsApiAnim03Schema } from "./HiggsApiAnim03ReleveBancaire";
import { HiggsApiAnim04BalayageProfils, higgsApiAnim04Schema } from "./HiggsApiAnim04BalayageProfils";
import { HiggsApiAnim05BasculePrix, higgsApiAnim05Schema } from "./HiggsApiAnim05BasculePrix";
import { HiggsApiAnim06DeuxEmplacements, higgsApiAnim06Schema } from "./HiggsApiAnim06DeuxEmplacements";
import { HiggsApiAnim07MurGeneration, higgsApiAnim07Schema } from "./HiggsApiAnim07MurGeneration";
import { HiggsApiAnim08OutilBrique, higgsApiAnim08Schema } from "./HiggsApiAnim08OutilBrique";
import { HiggsApiAnim09TuyauAPI, higgsApiAnim09Schema } from "./HiggsApiAnim09TuyauAPI";
import { HiggsOpusAnim01PelliculeFilm, higgsOpusAnim01Schema } from "./HiggsOpusAnim01PelliculeFilm";
import { HiggsOpusAnim02SchemaConnexionMCP, higgsOpusAnim02Schema } from "./HiggsOpusAnim02SchemaConnexionMCP";
import { HiggsOpusAnim03RoadmapEtapes, higgsOpusAnim03Schema } from "./HiggsOpusAnim03RoadmapEtapes";
import { HiggsOpusAnim04CalendrierSeptembre, higgsOpusAnim04Schema } from "./HiggsOpusAnim04CalendrierSeptembre";
import { HiggsOpusAnim05BalanceCoutCredits, higgsOpusAnim05Schema } from "./HiggsOpusAnim05BalanceCoutCredits";
import { HiggsOpusAnim06PromesseRealite, higgsOpusAnim06Schema } from "./HiggsOpusAnim06PromesseRealite";
import { HiggsOpusAnim07CtaAbonnementPouce, higgsOpusAnim07Schema } from "./HiggsOpusAnim07CtaAbonnementPouce";
import { HiggsOpusAnim08TransitionWipe, higgsOpusAnim08Schema } from "./HiggsOpusAnim08TransitionWipe";
import { AisaAnim01RapportFlip3D, aisaAnim01Schema } from "./AisaAnim01RapportFlip3D";
import { AisaAnim02OrbiteMoteursIA, aisaAnim02Schema } from "./AisaAnim02OrbiteMoteursIA";
import { AisaAnim03ConversationRestaurants, aisaAnim03Schema } from "./AisaAnim03ConversationRestaurants";
import { AisaAnim04SourcesVersNoyauIA, aisaAnim04Schema } from "./AisaAnim04SourcesVersNoyauIA";
import { AisaAnim05ClassementRemontee, aisaAnim05Schema } from "./AisaAnim05ClassementRemontee";
import { AisaAnim06GlobeUtilisateurs, aisaAnim06Schema } from "./AisaAnim06GlobeUtilisateurs";
import { AisaAnim07RecherchesQuotidien, aisaAnim07Schema } from "./AisaAnim07RecherchesQuotidien";
import { AisaAnim08BalanceGoogleVsIA, aisaAnim08Schema } from "./AisaAnim08BalanceGoogleVsIA";
import { AisaAnim09SeoVersGeo, aisaAnim09Schema } from "./AisaAnim09SeoVersGeo";
import { AisaAnim10OceanBleu, aisaAnim10Schema } from "./AisaAnim10OceanBleu";
import { AisaAnim11TransitionStatistiques, aisaAnim11Schema } from "./AisaAnim11TransitionStatistiques";
import { Atmos22Anim01QuestionReecrite, atmos22Anim01Schema } from "./Atmos22Anim01QuestionReecrite";
import { Atmos22Anim02AvalancheIdees, atmos22Anim02Schema } from "./Atmos22Anim02AvalancheIdees";
import { Atmos22Anim03Prompt47Idees, atmos22Anim03Schema } from "./Atmos22Anim03Prompt47Idees";
import { Atmos22Anim04Elimination47a1, atmos22Anim04Schema } from "./Atmos22Anim04Elimination47a1";
import { Atmos22Anim05TimelineDocumentee, atmos22Anim05Schema } from "./Atmos22Anim05TimelineDocumentee";
import { Atmos22Anim06LowerThirdAnnees, atmos22Anim06Schema } from "./Atmos22Anim06LowerThirdAnnees";
import { Atmos22Anim07AbonneCinetique, atmos22Anim07Schema } from "./Atmos22Anim07AbonneCinetique";
import { Atmos22Anim08TroisFaussesExcuses, atmos22Anim08Schema } from "./Atmos22Anim08TroisFaussesExcuses";
import { Atmos22Anim09ChargementBloque, atmos22Anim09Schema } from "./Atmos22Anim09ChargementBloque";
import { Atmos22Anim10DispersionFocus, atmos22Anim10Schema } from "./Atmos22Anim10DispersionFocus";
import { Atmos22Anim11RegleCompteRebours, atmos22Anim11Schema } from "./Atmos22Anim11RegleCompteRebours";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── TEMPLATES EXISTANTS ── */}
      <Composition
        id="DarkGridTitleCard"
        component={DarkGridTitleCard}
        schema={darkGridTitleCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Titre exemple",
          subtitle: undefined,
          footer: undefined,
          durationSecs: 5,
          accentColor: "#1a3a8f",
          fontKey: "jakarta",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="GlassMotionCard"
        component={GlassMotionCard}
        schema={glassMotionCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          label: "Revenus Mensuels",
          value: "$7.420",
          subtitle: "+$20.8% USD",
          layout: "horizontal",
          element: "linechart",
          countUp: true,
          linePoints: [0.3, 0.28, 0.38, 0.35, 0.5, 0.48, 0.62, 0.78, 0.92],
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />

      {/* ── NOUVEAUX TEMPLATES ── */}
      <Composition
        id="TypewriterCard"
        component={TypewriterCard}
        schema={typewriterCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          prompt: "Lo-fi relaxing study music",
          label: "Prompt IA",
          cursorColor: "#88aaff",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="FlowDiagram"
        component={FlowDiagram}
        schema={flowDiagramSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          steps: [
            { label: "PROMPT", emoji: "💬", isReward: false },
            { label: "IA", emoji: "🤖", isReward: false },
            { label: "MUSIQUE", emoji: "🎵", isReward: false },
            { label: "YOUTUBE", emoji: "📺", isReward: false },
            { label: "€€", emoji: "💰", isReward: true },
          ],
          accentColor: "#3060ff",
          durationSecs: 5,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="KineticTypography"
        component={KineticTypography}
        schema={kineticTypographySchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          word: "CHOQUE",
          subtitle: "L'intelligence artificielle",
          accentColor: "#3060ff",
          durationSecs: 3,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="WaveformVisualizer"
        component={WaveformVisualizer}
        schema={waveformVisualizerSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mode: "musique",
          label: "Musique générée par IA",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="SplitScreen"
        component={SplitScreen}
        schema={splitScreenSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          leftTitle: "❌ 10 ans d'expérience",
          leftItems: ["Apprendre le piano", "Studio coûteux", "Des années de pratique"],
          rightTitle: "✅ 1 Prompt IA",
          rightItems: ["1 clic", "Gratuit", "Résultat immédiat"],
          leftIsNegative: true,
          accentColor: "#3060ff",
          durationSecs: 5,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="TimelineCard"
        component={TimelineCard}
        schema={timelineCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          events: [
            { year: "2015", label: "Apprendre un instrument", emoji: "🎸", isPositive: false },
            { year: "2026", label: "Cliquer sur 'Générer'", emoji: "🤖", isPositive: true },
          ],
          accentColor: "#3060ff",
          durationSecs: 5,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="StarReviews"
        component={StarReviews}
        schema={starReviewsSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          rating: 5,
          reviewCount: 336,
          label: "Avis clients",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="ToggleCard"
        component={ToggleCard}
        schema={toggleCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          offLabel: "Paroles",
          onLabel: "Instrumental",
          title: "Sélectionne ton style",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="KaraokeCard"
        component={KaraokeCard}
        schema={karaokeCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lyrics: "Joyeux anniversaire Ibrahim joyeux anniversaire à toi",
          wordsPerSecond: 1.8,
          accentColor: "#3060ff",
          durationSecs: 6,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="MapCard"
        component={MapCard}
        schema={mapCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "Une opportunité unique",
          subtext: "Très peu de personnes utilisent l'IA pour la musique en Afrique",
          accentColor: "#3060ff",
          durationSecs: 5,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      {/* ── PART PROGRESS OVERLAY ── */}
      <Composition
        id="PartProgress"
        component={PartProgress}
        schema={partProgressSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          partLabel: "PARTIE 1",
          partNumber: 1,
          totalParts: 3,
          durationSecs: 215,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />

      {/* ── ANIMATIONS INTRO (segment accroche) ── */}
      <Composition
        id="MusicVsAI"
        component={MusicVsAI}
        schema={musicVsAISchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          accentColor: "#3060ff",
          durationSecs: 8,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="SkillMeter"
        component={SkillMeter}
        schema={skillMeterSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Niveau d'expérience requis",
          badgeLabel: "DÉBUTANT",
          accentColor: "#3060ff",
          durationSecs: 7,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="MysteryChecklist"
        component={MysteryChecklist}
        schema={mysteryChecklistSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Méthodes qui fonctionnent en 2026",
          items: [
            "Méthode #1 ████████████",
            "Méthode #2 ████████████",
            "Méthode #3 ████████████",
            "Méthode #4 ████████████",
          ],
          callToAction: "▶ Révélé dans cette vidéo",
          accentColor: "#3060ff",
          durationSecs: 8,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />

      {/* ── NOUVEAUX TEMPLATES — VIDÉO VERDANT.AI ── */}
      <Composition
        id="ScreenHighlight"
        component={ScreenHighlight}
        schema={screenHighlightSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          annotationText: "Menu Prospection",
          arrowDirection: "right" as const,
          boxColor: "#FFD700",
          centerX: 0.5,
          centerY: 0.5,
          boxWidth: 380,
          boxHeight: 54,
          accentColor: "#3060ff",
          durationSecs: 3,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="CascadeText"
        component={CascadeText}
        schema={cascadeTextSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lines: [
            "Donner des idées.",
            "Écrire des emails.",
            "C'est bien... mais c'est basique.",
          ],
          highlight: "basique",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="StatusTransition"
        component={StatusTransition}
        schema={statusTransitionSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          errorText: "BUG",
          successText: "RÉGLÉ",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="IconPair"
        component={IconPair}
        schema={iconPairSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          leftIcon: "⚙️",
          rightIcon: "💰",
          leftBadge: undefined,
          mode: "spin" as const,
          subtitle: "Systèmes automatisés",
          accentColor: "#3060ff",
          durationSecs: 4,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />
      <Composition
        id="CTACard"
        component={CTACard}
        schema={ctaCardSchema}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          linkText: "👇 Lien dans la description",
          badgeText: "S'abonner",
          accentColor: "#3060ff",
          durationSecs: 5,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.round(props.durationSecs * 30),
        })}
      />

      {/* ════════════════════════════════════════════════
          VIDÉO VERDANT.AI — 53 ANIMATIONS INDIVIDUELLES
          ════════════════════════════════════════════════ */}

      {/* ── HOOK / INTRO ── */}
      <Composition id="Anim01-TextIA" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "La majorité des gens utilisent l'IA comme ça...", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim02-ChatGPTLimite" component={IconPair} schema={iconPairSchema} fps={30} width={1920} height={1080}
        defaultProps={{ leftIcon: "🤖", rightIcon: "💬", leftBadge: "❌", mode: "badge" as const, subtitle: "ChatGPT — Basique", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim03-CascadeBasique" component={CascadeText} schema={cascadeTextSchema} fps={30} width={1920} height={1080}
        defaultProps={{ lines: ["Donner des idées.", "Écrire des emails.", "C'est bien... mais c'est basique."], highlight: "basique", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim04-PlusDArgent" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "PLUS D'ARGENT", accentColor: "#f97316", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim05-Plus1An" component={GlassMotionCard} schema={glassMotionCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "En production depuis", value: "1", subtitle: "an(s) d'utilisation IA", layout: "default" as const, element: "none" as const, countUp: true, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim06-SplitIA" component={SplitScreen} schema={splitScreenSchema} fps={30} width={1920} height={1080}
        defaultProps={{ leftTitle: "❌ IA classique", leftItems: ["Répondre à des questions", "Donner des idées", "Écrire des emails"], rightTitle: "✅ IA niveau sup", rightItems: ["Mettre en place des systèmes", "Automatiser des tâches", "Travailler à ta place"], leftIsNegative: true, accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim07-TravaillePlace" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Elle travaille à ta place.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim08-EngrainageDollar" component={IconPair} schema={iconPairSchema} fps={30} width={1920} height={1080}
        defaultProps={{ leftIcon: "⚙️", rightIcon: "💰", mode: "spin" as const, subtitle: "Systèmes automatisés", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim09-ResteFinVideo" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Reste jusqu'à la fin.", subtitle: "La méthode complète t'attend", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim10-Tease3Etapes" component={FlowDiagram} schema={flowDiagramSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Trouver les marques", emoji: "🔍", isReward: false }, { label: "Rédiger les emails", emoji: "✏️", isReward: false }, { label: "Envoyer automatiquement", emoji: "📤", isReward: true }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim11-JeMontreTout" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Je te montre TOUT.", accentColor: "#3060ff", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── TRANSITION → PARTIE 1 ── */}
      <Composition id="Anim12-TransitionP1" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 1", subtitle: "Le problème à résoudre", accentColor: "#1a3a8f", durationSecs: 3, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── PARTIE 1 ── */}
      <Composition id="Anim13-TitreP1" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 1", subtitle: "Pourquoi j'ai tout automatisé", accentColor: "#1a3a8f", durationSecs: 4, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim14-ProgressP1" component={PartProgress} schema={partProgressSchema} fps={30} width={1920} height={1080}
        defaultProps={{ partLabel: "PARTIE 1", partNumber: 1, totalParts: 3, durationSecs: 60 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim15-3OptionsPartenariat" component={CascadeText} schema={cascadeTextSchema} fps={30} width={1920} height={1080}
        defaultProps={{ lines: ["🏆 Grande communauté → Marques viennent à toi", "🏢 Agence → 20–25% de commission", "✅ Toi-même → Prospection directe"], highlight: "Toi-même", accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim16-Commission2025" component={GlassMotionCard} schema={glassMotionCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "Commission d'agence", value: "20–25%", subtitle: "Pas transparent. Pas optimal.", layout: "default" as const, element: "none" as const, countUp: false, accentColor: "#ef4444", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim17-PasTransparent" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Pas transparent. Pas optimal.", accentColor: "#ef4444", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim18-ApolloPrice" component={GlassMotionCard} schema={glassMotionCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "Apollo.io", value: "$200 / mois ❌", subtitle: "Extrêmement cher", layout: "default" as const, element: "none" as const, countUp: false, accentColor: "#ef4444", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim19-Rehook200" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "200$ par mois. Juste pour ça.", accentColor: "#ef4444", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim20-LaSolution" component={CascadeText} schema={cascadeTextSchema} fps={30} width={1920} height={1080}
        defaultProps={{ lines: ["La solution ?", "Un agent IA."], highlight: "agent IA", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim21-FluxAgent3" component={FlowDiagram} schema={flowDiagramSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Chercher", emoji: "🔍", isReward: false }, { label: "Rédiger", emoji: "✏️", isReward: false }, { label: "Envoyer", emoji: "📤", isReward: true }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim22-ToutAutomatise" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Tout ça. Automatisé.", accentColor: "#3060ff", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim23-RehookGagnerPlus" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Et ça me fait gagner plus, en faisant moins.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── TRANSITION → PARTIE 2 ── */}
      <Composition id="Anim24-TransitionP2" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 2", subtitle: "La démo complète", accentColor: "#1a3a8f", durationSecs: 3, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── PARTIE 2 ── */}
      <Composition id="Anim25-TitreP2" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 2", subtitle: "Je te montre tout en live", accentColor: "#1a3a8f", durationSecs: 4, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim26-ProgressP2" component={PartProgress} schema={partProgressSchema} fps={30} width={1920} height={1080}
        defaultProps={{ partLabel: "PARTIE 2", partNumber: 2, totalParts: 3, durationSecs: 60 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim27-VerdantAI" component={TypewriterCard} schema={typewriterCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ prompt: "Verdant.ai", label: "L'outil de la vidéo", cursorColor: "#88aaff", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim28-PrixVerdant" component={GlassMotionCard} schema={glassMotionCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "Tarification Verdant.ai", value: "$19 / mois", subtitle: "✅ 7 jours gratuits inclus", layout: "default" as const, element: "none" as const, countUp: false, accentColor: "#22c55e", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim29-HighlightChat" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Zone de chat Verdant", arrowDirection: "left" as const, boxColor: "#FFD700", centerX: 0.65, centerY: 0.5, boxWidth: 500, boxHeight: 380, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim30-AgentAutomatisation" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Un agent IA = une automatisation autonome", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim31-Flux3Taches" component={FlowDiagram} schema={flowDiagramSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Chercher une marque", emoji: "🔍", isReward: false }, { label: "Rédiger un email", emoji: "✏️", isReward: false }, { label: "Envoyer", emoji: "📤", isReward: true }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim32-RehookSemiAuto" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Semi-automatique = tu gardes le contrôle.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim33-HighlightMenuPros" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Menu Prospection", arrowDirection: "down" as const, boxColor: "#4ade80", centerX: 0.22, centerY: 0.12, boxWidth: 210, boxHeight: 38, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim34-HighlightEtape1" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Étape 1 : Initialiser les onglets", arrowDirection: "right" as const, boxColor: "#60a5fa", centerX: 0.38, centerY: 0.3, boxWidth: 290, boxHeight: 46, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim35-BugRegle" component={StatusTransition} schema={statusTransitionSchema} fps={30} width={1920} height={1080}
        defaultProps={{ errorText: "BUG", successText: "RÉGLÉ", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim36-RehookBugCapture" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Quand ça bug → tu montres la capture. L'IA fixe.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim37-Compteur20Marques" component={GlassMotionCard} schema={glassMotionCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "Marques découvertes", value: "20", subtitle: "En un seul clic", layout: "default" as const, element: "none" as const, countUp: true, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim38-HighlightLogos" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Canva • Grammarly • VidIQ", arrowDirection: "down" as const, boxColor: "#a78bfa", centerX: 0.5, centerY: 0.42, boxWidth: 720, boxHeight: 210, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim39-1Clic20Marques" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "1 clic. 20 marques trouvées.", accentColor: "#3060ff", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim40-RehookEmails" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Et il trouve même les emails.", accentColor: "#3060ff", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim41-HighlightColEmails" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Emails trouvés automatiquement ✅", arrowDirection: "left" as const, boxColor: "#34d399", centerX: 0.62, centerY: 0.5, boxWidth: 310, boxHeight: 360, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim42-GenerationBrouillons" component={TypewriterCard} schema={typewriterCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ prompt: "Génération des brouillons en cours...", label: "Agent en action", cursorColor: "#88aaff", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim43-HighlightVariables" component={ScreenHighlight} schema={screenHighlightSchema} fps={30} width={1920} height={1080}
        defaultProps={{ annotationText: "Variables dynamiques", arrowDirection: "right" as const, boxColor: "#fb923c", centerX: 0.5, centerY: 0.55, boxWidth: 620, boxHeight: 62, accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim44-RehookPersonnalise" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Personnalisé. Automatique. Pour 20 marques.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim45-EmailEnvoye" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Email test envoyé ✅", subtitle: "La fonctionnalité d'envoi fonctionne", accentColor: "#22c55e", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── TRANSITION → PARTIE 3 ── */}
      <Composition id="Anim46-TransitionP3" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 3", subtitle: "Les résultats & comment t'en servir", accentColor: "#1a3a8f", durationSecs: 3, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── PARTIE 3 ── */}
      <Composition id="Anim47-TitreP3" component={DarkGridTitleCard} schema={darkGridTitleCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "PARTIE 3", subtitle: "Ce que ça change vraiment", accentColor: "#1a3a8f", durationSecs: 4, fontKey: "jakarta" }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim48-ProgressP3" component={PartProgress} schema={partProgressSchema} fps={30} width={1920} height={1080}
        defaultProps={{ partLabel: "PARTIE 3", partNumber: 3, totalParts: 3, durationSecs: 60 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim49-Recap4Fonctions" component={FlowDiagram} schema={flowDiagramSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Découvrir des marques", emoji: "🔍", isReward: false }, { label: "Trouver les emails", emoji: "📱", isReward: false }, { label: "Générer les brouillons", emoji: "✏️", isReward: false }, { label: "Envoyer", emoji: "📤", isReward: true }], accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim50-PasEn1Clic" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Ça se fera pas en 1 clic. Mais l'IA fixe tout.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim51-PasExpert" component={KineticTypography} schema={kineticTypographySchema} fps={30} width={1920} height={1080}
        defaultProps={{ word: "Pas besoin d'être expert.", accentColor: "#3060ff", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim52-SplitUsages" component={SplitScreen} schema={splitScreenSchema} fps={30} width={1920} height={1080}
        defaultProps={{ leftTitle: "✅ Utilise pour TOI", leftItems: ["Automatise ta prospection", "Moins de dépenses", "Plus de partenariats"], rightTitle: "💼 Propose à des clients", rightItems: ["Toute entreprise a besoin de prospects", "Service à haute valeur", "Revenue récurrent"], leftIsNegative: false, accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      <Composition id="Anim53-CTAFinal" component={CTACard} schema={ctaCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ linkText: "👇 Lien dans la description", badgeText: "S'abonner", accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ════ ANIMATIONS instructions.rtf ════ */}
      <Composition id="Anim02-Iceberg" component={Anim02Iceberg} schema={anim02Schema} fps={30} width={1920} height={1080}
        defaultProps={{ visibleLabel: "ChatGPT pour les questions", hiddenItems: ["Agents IA", "Systèmes automatiques", "Revenus passifs", "Business autonome"], accentColor: "#3b82f6", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim03-Timeline" component={Anim03Timeline} schema={anim03Schema} fps={30} width={1920} height={1080}
        defaultProps={{ name: "Ibrahim Kamara", subtitle: "6 ans de business sur Internet", milestones: [{ year: "2019", label: "Début", emoji: "💻", isHighlight: false }, { year: "2020", label: "1ers revenus", emoji: "💰", isHighlight: false }, { year: "2021", label: "Croissance", emoji: "📈", isHighlight: false }, { year: "2022", label: "Scale", emoji: "🚀", isHighlight: false }, { year: "2023", label: "IA intégrée", emoji: "🤖", isHighlight: false }, { year: "2024", label: "Automatisation", emoji: "⚡", isHighlight: false }, { year: "2025", label: "Business autonome", emoji: "🏆", isHighlight: true }], accentColor: "#3b82f6", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim04-TrendGraph" component={Anim04TrendGraph} schema={anim04Schema} fps={30} width={1920} height={1080}
        defaultProps={{ keyword: "ChatGPT", xLabels: ["2020", "2021", "2022", "2023", "2024"], explosionLabel: "× 10 000 recherches", accentColor: "#3b82f6", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim05-MindMap" component={Anim05MindMap} schema={anim05Schema} fps={30} width={1920} height={1080}
        defaultProps={{ centerLabel: "Mon business", branches: [{ label: "Emails", emoji: "✉️" }, { label: "Prospection", emoji: "🔍" }, { label: "Contenu", emoji: "📱" }, { label: "Facturation", emoji: "💳" }, { label: "Réponses clients", emoji: "💬" }, { label: "Social media", emoji: "📣" }], accentColor: "#3b82f6", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim06-Partnerships" component={Anim06Partnerships} schema={anim06Schema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "3 façons d'avoir des partenariats", cards: [{ emoji: "👥", title: "Grosse communauté", description: "Les marques te contactent directement", tag: "Passif", variant: "neutral" }, { emoji: "🏢", title: "Agence d'influence", description: "−20 à 25% de commission sur chaque deal", tag: "−25%", variant: "warning" }, { emoji: "👑", title: "Tu contactes toi-même", description: "Maximum de revenus, zéro intermédiaire", tag: "Recommandé", variant: "winner" }], accentColor: "#3b82f6", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim07-ExpenseCounter" component={Anim07ExpenseCounter} schema={anim07Schema} fps={30} width={1920} height={1080}
        defaultProps={{ toolName: "Apollo.io", maxAmount: 200, currency: "$", unit: "/ mois", accentColor: "#3b82f6", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim08-Flowchart" component={Anim08Flowchart} schema={anim08Schema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "Mon agent IA en action", steps: [{ emoji: "🔍", label: "Recherche de marques", sublabel: "Automatique", isHuman: false }, { emoji: "✍️", label: "Rédaction emails", sublabel: "Personnalisé", isHuman: false }, { emoji: "📤", label: "Envoi automatique", sublabel: "24h/24", isHuman: false }, { emoji: "📥", label: "Réponses reçues", sublabel: "Notifié", isHuman: false }, { emoji: "👤", label: "Tu prends le relais", sublabel: "Closing", isHuman: true }], accentColor: "#3b82f6", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim09-EmailHandoff" component={Anim09EmailHandoff} schema={anim09Schema} fps={30} width={1920} height={1080}
        defaultProps={{ from: "Nike France — partnerships@nike.fr", subject: "Partenariat YouTube — On est intéressés ! 🎯", preview: "Bonjour Ibrahim, nous avons découvert votre chaîne et nous aimerions discuter…", accentColor: "#3b82f6", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim10-Vault" component={Anim10Vault} schema={anim10Schema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "Ce système m'a changé la vie", suspenseLabel: "Les vrais chiffres →", blurredAmount: "10.000€", accentColor: "#3b82f6", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />
      <Composition id="Anim11-Checklist" component={Anim11Checklist} schema={anim11Schema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "Comment mettre en place le système", items: ["Trouver des prospects avec l'IA", "Rédiger les emails automatiquement", "Envoyer + suivre les réponses", "Négocier et closer les deals"], cta: "La dernière étape → dans la vidéo", accentColor: "#3b82f6", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* Level Comparison — Niveau 1 vs Niveau 2 */}
      <Composition id="LevelComparison" component={LevelComparison} schema={levelComparisonSchema} fps={30} width={1920} height={1080}
        defaultProps={{ chatQuery: "comment faire une recette ?", chatResponse: "Voici les étapes pour préparer…", systemCards: [{ emoji: "✉️", label: "Emails envoyés", value: "47" }, { emoji: "💰", label: "Revenus", value: "+340€" }, { emoji: "✅", label: "Tâches", value: "8 / 8" }, { emoji: "🤖", label: "Agents IA", value: "actifs" }], accentColor: "#3b82f6", durationSecs: 8 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* Iceberg Reveal — nouvelle version */}
      <Composition id="IcebergReveal" component={IcebergReveal} schema={icebergRevealSchema} fps={30} width={1920} height={1080}
        defaultProps={{ chatgptQuestions: ["Comment gagner de l'argent ?", "Écris-moi un email", "Donne-moi des idées"], icebergVisible: "Poser des questions", icebergHidden: ["Automatisation", "Agents IA", "Systèmes", "Business"], accentColor: "#3b82f6", durationSecs: 8 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ════════════════════════════════════════════════
          VIDÉO IA PROSPECTION — 26 ANIMATIONS
          ════════════════════════════════════════════════ */}

      {/* V01 — Iceberg Split Screen */}
      <Composition id="VerdAnim01-IcebergSplit" component={IcebergSplit} schema={icebergSplitSchema} fps={30} width={1920} height={1080}
        defaultProps={{ chatgptQuestions: ["Comment gagner de l'argent ?", "Écris-moi un email", "Donne-moi des idées"], icebergVisible: "Poser des questions", icebergHidden: ["Automatisation", "Agents IA", "Systèmes", "Business"], accentColor: "#3060ff", durationSecs: 8 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V02 — Level Up Game */}
      <Composition id="VerdAnim02-LevelUp" component={LevelUpCard} schema={levelUpCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ levels: [{ number: 1, label: "CHATGPT USER", color: "#888888" }, { number: 2, label: "AI SYSTEM BUILDER", color: "#3060ff" }, { number: 3, label: "AUTOMATED BUSINESS", color: "#ffd700" }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V03 — Autopilot Dashboard */}
      <Composition id="VerdAnim03-Autopilot" component={AutopilotDashboard} schema={autopilotDashboardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ avatarLabel: "Ibrahim", tasks: [{ emoji: "✉️", label: "Emails envoyés", value: "47" }, { emoji: "🔔", label: "Notifications", value: "12" }, { emoji: "💰", label: "Revenus générés", value: "+340€" }, { emoji: "✅", label: "Tâches complétées", value: "8/8" }], accentColor: "#3060ff", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V04 — Timeline 2024→2026 (réutilise TimelineCard) */}
      <Composition id="VerdAnim04-Timeline" component={TimelineCard} schema={timelineCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ events: [{ year: "2024", label: "Manuel & Apollo.io", emoji: "😓", isPositive: false }, { year: "2025", label: "Automatisation IA", emoji: "🤖", isPositive: true }, { year: "2026", label: "Business automatisé", emoji: "💰", isPositive: true }], accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V05 — Chronologie ChatGPT (réutilise TimelineCard) */}
      <Composition id="VerdAnim05-ChatGPTHistory" component={TimelineCard} schema={timelineCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ events: [{ year: "2022", label: "Lancement ChatGPT", emoji: "🚀", isPositive: true }, { year: "2023", label: "Explosion mondiale", emoji: "💥", isPositive: true }, { year: "2026", label: "Agents IA autonomes", emoji: "🤖", isPositive: true }], accentColor: "#3060ff", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V06 — Comparison Columns */}
      <Composition id="VerdAnim06-Comparison" component={ComparisonColumns} schema={comparisonColumnsSchema} fps={30} width={1920} height={1080}
        defaultProps={{ leftTitle: "CHATGPT", leftItems: ["Idées", "Emails", "Réponses"], rightTitle: "AGENT IA", rightItems: ["Prospecte", "Écrit", "Envoie", "Analyse", "Automatise"], highlightRight: true, accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V07 — Org Chart Chaos → Order */}
      <Composition id="VerdAnim07-OrgChart" component={OrgChartChaos} schema={orgChartChaosSchema} fps={30} width={1920} height={1080}
        defaultProps={{ centerLabel: "IBRAHIM", nodes: [{ label: "Monteur", emoji: "🎬" }, { label: "Assistant", emoji: "👤" }, { label: "Client", emoji: "💼" }, { label: "Marques", emoji: "🏷️" }, { label: "Comptabilité", emoji: "📊" }], accentColor: "#3060ff", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V08 — Lego Blocks → SYSTEM */}
      <Composition id="VerdAnim08-LegoBlocks" component={LegoBlocks} schema={legoBlocksSchema} fps={30} width={1920} height={1080}
        defaultProps={{ blocks: [{ label: "Recherche", color: "#3b82f6", emoji: "🔍" }, { label: "Emails", color: "#8b5cf6", emoji: "✉️" }, { label: "Prospection", color: "#ec4899", emoji: "📊" }, { label: "CRM", color: "#f59e0b", emoji: "🗂️" }, { label: "Réponses", color: "#10b981", emoji: "💬" }], resultLabel: "SYSTEM", accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V09 — Mystery Vault */}
      <Composition id="VerdAnim09-MysteryVault" component={MysteryVault} schema={mysteryVaultSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "Système #1", blurredAmount: "XX XXX €", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V10 — Video Wall */}
      <Composition id="VerdAnim10-VideoWall" component={VideoWall} schema={videoWallSchema} fps={30} width={1920} height={1080}
        defaultProps={{ channelName: "Ibrahim Camara", softwareLogos: [{ name: "ChatGPT", emoji: "🤖" }, { name: "Claude AI", emoji: "✦" }, { name: "Make.com", emoji: "⚙️" }, { name: "Verdant.ai", emoji: "🌿" }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V11 — Workflow YouTube → Argent (réutilise FlowDiagram) */}
      <Composition id="VerdAnim11-YoutubeWorkflow" component={FlowDiagram} schema={flowDiagramSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Chaîne YouTube", emoji: "📺", isReward: false }, { label: "Marque", emoji: "🏷️", isReward: false }, { label: "Contrat", emoji: "📄", isReward: false }, { label: "Paiement", emoji: "💳", isReward: false }, { label: "Compte Bancaire", emoji: "💰", isReward: true }], accentColor: "#3060ff", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V12 — Decision Tree */}
      <Composition id="VerdAnim12-DecisionTree" component={DecisionTreeCard} schema={decisionTreeCardSchema} fps={30} width={1920} height={1080}
        defaultProps={{ startLabel: "START", paths: [{ label: "Grande audience", sublabel: "Les marques viennent à toi", isHighlighted: false }, { label: "Agence", sublabel: "20–25% de commission", isHighlighted: false }, { label: "Prospection directe", sublabel: "✅ La meilleure option", isHighlighted: true }], accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V13 — Money Flow (Agence) */}
      <Composition id="VerdAnim13-MoneyFlow" component={MoneyFlow} schema={moneyFlowSchema} fps={30} width={1920} height={1080}
        defaultProps={{ totalAmount: "1 000 €", agencyLabel: "AGENCE", agencyPercent: 25, netLabel: "Pour toi", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V14 — Manual Work Montage */}
      <Composition id="VerdAnim14-ManualWork" component={ManualWorkMontage} schema={manualWorkMontageSchema} fps={30} width={1920} height={1080}
        defaultProps={{ tasks: [{ emoji: "🔍", label: "Cherche sur Google" }, { emoji: "📋", label: "Copie-colle" }, { emoji: "📧", label: "Trouve les emails" }, { emoji: "📤", label: "Envoie les emails" }], endLabel: "FASTIDIEUX", accentColor: "#ef4444", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V15 — SaaS Mockup */}
      <Composition id="VerdAnim15-SaaSMockup" component={SaaSMockup} schema={saasMockupSchema} fps={30} width={1920} height={1080}
        defaultProps={{ appName: "ProspectAI", searchTerms: ["Marketing Manager", "Influencer Manager", "Brand Partnership Manager"], results: [{ name: "Sarah M.", company: "Canva", role: "Head of Influencer Marketing" }, { name: "James R.", company: "Grammarly", role: "Brand Partnership Manager" }, { name: "Léa D.", company: "Adobe", role: "Marketing Manager" }, { name: "Kevin T.", company: "Notion", role: "Influencer Relations Lead" }], prices: ["100 $ / mois", "200 $ / mois"], accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V16 — Money Counter */}
      <Composition id="VerdAnim16-MoneyCounter" component={MoneyCounter} schema={moneyCounterSchema} fps={30} width={1920} height={1080}
        defaultProps={{ label: "Dépenses mensuelles", currency: "$", amounts: [200, 400, 600, 800], unit: "/ mois", accentColor: "#ef4444", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V17 — AI Robot Intro */}
      <Composition id="VerdAnim17-AIRobot" component={AIRobotIntro} schema={aiRobotIntroSchema} fps={30} width={1920} height={1080}
        defaultProps={{ robotName: "AI Agent", subtitle: "Ton système de prospection automatisé", accentColor: "#00d4ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V18 — World Map Scan */}
      <Composition id="VerdAnim18-WorldMap" component={WorldMapScan} schema={worldMapScanSchema} fps={30} width={1920} height={1080}
        defaultProps={{ collectibles: [{ emoji: "🏷️", label: "Marque", x: 0.22, y: 0.3 }, { emoji: "✉️", label: "Email", x: 0.65, y: 0.25 }, { emoji: "👤", label: "Contact", x: 0.45, y: 0.55 }, { emoji: "🏷️", label: "Marque", x: 0.78, y: 0.6 }, { emoji: "✉️", label: "Email", x: 0.15, y: 0.65 }], accentColor: "#00d4ff", durationSecs: 7 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V19 — Gmail Typewriter */}
      <Composition id="VerdAnim19-Gmail" component={GmailTypewriter} schema={gmailTypewriterSchema} fps={30} width={1920} height={1080}
        defaultProps={{ to: "partnerships@canva.com", subject: "Partenariat YouTube — Ibrahim Camara", emailBody: "Bonjour,\n\nJe suis YouTubeur avec 50K abonnés dans le domaine du business digital. Je serais ravi de collaborer avec Canva pour une vidéo sponsorisée.\n\nMon audience correspond parfaitement à votre cible.\n\nCordialement,\nIbrahim", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V20 — Email Blast */}
      <Composition id="VerdAnim20-EmailBlast" component={EmailBlast} schema={emailBlastSchema} fps={30} width={1920} height={1080}
        defaultProps={{ stages: [50, 100, 200], label: "emails envoyés simultanément", accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V21 — Inbox Notifications */}
      <Composition id="VerdAnim21-Inbox" component={InboxNotifications} schema={inboxNotificationsSchema} fps={30} width={1920} height={1080}
        defaultProps={{ emails: [{ from: "Canva Partnerships", subject: "Interested — Let's discuss", preview: "Merci pour votre email ! Nous serions ravis de...", tag: "Intéressé", tagColor: "#22c55e" }, { from: "Grammarly Brand", subject: "Let's talk — Partnership", preview: "Bonjour, votre profil correspond exactement à...", tag: "Réponse positive", tagColor: "#3060ff" }, { from: "Adobe Creative", subject: "Partnership — Confirmed ✓", preview: "Nous confirmons notre partenariat pour Q2...", tag: "Confirmé ✓", tagColor: "#f59e0b" }], accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V22 — Manual Approval */}
      <Composition id="VerdAnim22-ManualApproval" component={ManualApproval} schema={manualApprovalSchema} fps={30} width={1920} height={1080}
        defaultProps={{ robotLabel: "AI Agent", buttonLabel: "MANUAL APPROVAL", subtitle: "Tu gardes le contrôle", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V23 — Full Workflow Zoom */}
      <Composition id="VerdAnim23-FullWorkflow" component={FullWorkflowZoom} schema={fullWorkflowZoomSchema} fps={30} width={1920} height={1080}
        defaultProps={{ steps: [{ label: "Prospect", emoji: "🎯", color: "#3060ff" }, { label: "Recherche", emoji: "🔍", color: "#8b5cf6" }, { label: "Email", emoji: "✉️", color: "#ec4899" }, { label: "Envoi", emoji: "📤", color: "#f59e0b" }, { label: "Réponse", emoji: "💬", color: "#22c55e" }, { label: "Partenariat", emoji: "🤝", color: "#06b6d4" }, { label: "Argent", emoji: "💰", color: "#ffd700" }], accentColor: "#3060ff", durationSecs: 9 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V24 — Double Graph */}
      <Composition id="VerdAnim24-DoubleGraph" component={DoubleGraph} schema={doubleGraphSchema} fps={30} width={1920} height={1080}
        defaultProps={{ revenueLabel: "Revenus", expensesLabel: "Dépenses", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V25 — Blurred Reveal */}
      <Composition id="VerdAnim25-BlurredReveal" component={BlurredReveal} schema={blurredRevealSchema} fps={30} width={1920} height={1080}
        defaultProps={{ blurredAmount: "XX XXX €", revealText: "Révélé dans quelques minutes", accentColor: "#3060ff", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* V26 — Steps Checklist (réutilise MysteryChecklist sans flou) */}
      <Composition id="VerdAnim26-StepsChecklist" component={MysteryChecklist} schema={mysteryChecklistSchema} fps={30} width={1920} height={1080}
        defaultProps={{ title: "Comment je vais te montrer ça", items: ["Étape 1", "Étape 2", "Étape 3", "Étape 4"], callToAction: "▶ Processus complet ci-dessous", accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ════════════════════════════════════════════════
          VIDÉO ATMOS — 8 ANIMATIONS UNIQUES
          ════════════════════════════════════════════════ */}

      {/* A01 — La Haine — scène émotionnelle d'intro */}
      <Composition id="AtmosAnim01-HateScene" component={AtmosAnim01HateScene} schema={atmosAnim01Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A02 — Compteur de revenus — arcs circulaires par palier */}
      <Composition id="AtmosAnim02-RevenueCounter" component={AtmosAnim02RevenueCounter} schema={atmosAnim02Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A03 — Crédibilité Ibrahim — timeline horizontale avec blur reveal */}
      <Composition id="AtmosAnim03-CredibilityTimeline" component={AtmosAnim03CredibilityTimeline} schema={atmosAnim03Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A04 — Piège généraliste — logo ALL-IN-ONE rejeté par les entreprises */}
      <Composition id="AtmosAnim04-GeneralistTrap" component={AtmosAnim04GeneralistTrap} schema={atmosAnim04Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A05 — Ciblage niche — entonnoir en 3 couches */}
      <Composition id="AtmosAnim05-NicheZoom" component={AtmosAnim05NicheZoom} schema={atmosAnim05Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A06 — Sage vs ton app — split screen complexe vs épuré */}
      <Composition id="AtmosAnim06-SageVsApp" component={AtmosAnim06SageVsApp} schema={atmosAnim06Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A07 — Défilé de niches — grille de cards en vague diagonale */}
      <Composition id="AtmosAnim07-NicheCards" component={AtmosAnim07NicheCards} schema={atmosAnim07Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 6 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A08 — L'IA qui code — IDE builder avec prompt + génération de code */}
      <Composition id="AtmosAnim08-AIBuilder" component={AtmosAnim08AIBuilder} schema={atmosAnim08Schema} fps={30} width={1920} height={1080}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ════════════════════════════════════════════════
          VIDÉO ATMOS 2 — 10 OVERLAYS TRANSPARENTS (par-dessus la face cam)
          ════════════════════════════════════════════════ */}

      {/* A09 — Le morphing de la question */}
      <Composition id="AtmosAnim09-QuestionMorph" component={AtmosAnim09QuestionMorph} schema={atmosAnim09Schema} fps={30} width={1920} height={1080}
        defaultProps={{ question: "Suis-je capable de lancer un business en ligne ?", answer: "LEQUEL CHOISIR ?", durationSecs: 4 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A10 — L'explosion d'accessibilité */}
      <Composition id="AtmosAnim10-AccessibilityBurst" component={AtmosAnim10AccessibilityBurst} schema={atmosAnim10Schema} fps={30} width={1920} height={1080}
        defaultProps={{ durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A11 — La montagne d'idées */}
      <Composition id="AtmosAnim11-IdeaMountain" component={AtmosAnim11IdeaMountain} schema={atmosAnim11Schema} fps={30} width={1920} height={1080}
        defaultProps={{ durationSecs: 3.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A12 — Le compteur 47 */}
      <Composition id="AtmosAnim12-Counter47" component={AtmosAnim12Counter47} schema={atmosAnim12Schema} fps={30} width={1920} height={1080}
        defaultProps={{ targetNumber: 47, label: "IDÉES", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A13 — L'entonnoir de sélection */}
      <Composition id="AtmosAnim13-SelectionFunnel" component={AtmosAnim13SelectionFunnel} schema={atmosAnim13Schema} fps={30} width={1920} height={1080}
        defaultProps={{ resultLabel: "CELLE-LÀ.", durationSecs: 3.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A14 — Le lower-third de présentation */}
      <Composition id="AtmosAnim14-LowerThird" component={AtmosAnim14LowerThird} schema={atmosAnim14Schema} fps={30} width={1920} height={1080}
        defaultProps={{ name: "IBRAHIM KAMARA", tagline: "Business en ligne depuis 2020", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A15 — Le CTA abonnement */}
      <Composition id="AtmosAnim15-CTASubscribe" component={AtmosAnim15CTASubscribe} schema={atmosAnim15Schema} fps={30} width={1920} height={1080}
        defaultProps={{ buttonText: "S'ABONNER", durationSecs: 2.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A16 — Le triple constat barré */}
      <Composition id="AtmosAnim16-TripleStrike" component={AtmosAnim16TripleStrike} schema={atmosAnim16Schema} fps={30} width={1920} height={1080}
        defaultProps={{ lines: ["Pas d'idées", "Pas d'outils", "Pas de budget"], durationSecs: 4.5 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A17 — Le mot clé isolé */}
      <Composition id="AtmosAnim17-KeywordIsolate" component={AtmosAnim17KeywordIsolate} schema={atmosAnim17Schema} fps={30} width={1920} height={1080}
        defaultProps={{ text: "PASSER À L'ACTION", durationSecs: 3 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* A18 — Le sceau de preuve */}
      <Composition id="AtmosAnim18-ProofStamp" component={AtmosAnim18ProofStamp} schema={atmosAnim18Schema} fps={30} width={1920} height={1080}
        defaultProps={{ stampText: "PREUVE EN DIRECT", durationSecs: 2 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.durationSecs * 30) })} />

      {/* ── TEEM DROP — Animation 1: Chaos logiciels → iPhone révélé */}
      <Composition
        id="TeemDrop01"
        component={TeemDrop}
        schema={teemDropSchema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 2: Parcours A→Z avec checkpoints */}
      <Composition
        id="TeemDrop02"
        component={TeemDrop02}
        schema={teemDrop02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 3: Compteur 6 ANS */}
      <Composition
        id="TeemDrop03"
        component={TeemDrop03}
        schema={teemDrop03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 4: CTA Pouce */}
      <Composition
        id="TeemDrop04"
        component={TeemDrop04}
        schema={teemDrop04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 5: Flashback Vintage Côte d'Ivoire */}
      <Composition
        id="TeemDrop05"
        component={TeemDrop05}
        schema={teemDrop05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 6: Compteur 0€→300€ */}
      <Composition
        id="TeemDrop06"
        component={TeemDrop06}
        schema={teemDrop06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 7: Avant / Maintenant (balayage diagonal) */}
      <Composition
        id="TeemDrop07"
        component={TeemDrop07}
        schema={teemDrop07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 8: Briefing de Mission */}
      <Composition
        id="TeemDrop08"
        component={TeemDrop08}
        schema={teemDrop08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 9: Cartes de Chapitre (5 étapes) */}
      <Composition
        id="TeemDrop09Step1"
        component={TeemDrop09Step1}
        schema={teemDrop09Step1Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />
      <Composition
        id="TeemDrop09Step2"
        component={TeemDrop09Step2}
        schema={teemDrop09Step2Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />
      <Composition
        id="TeemDrop09Step3"
        component={TeemDrop09Step3}
        schema={teemDrop09Step3Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />
      <Composition
        id="TeemDrop09Step4"
        component={TeemDrop09Step4}
        schema={teemDrop09Step4Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />
      <Composition
        id="TeemDrop09Step5"
        component={TeemDrop09Step5}
        schema={teemDrop09Step5Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 10: Carrousel niches saisonnières */}
      <Composition
        id="TeemDrop10"
        component={TeemDrop10}
        schema={teemDrop10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 11: Mockup chat IA */}
      <Composition
        id="TeemDrop11"
        component={TeemDrop11}
        schema={teemDrop11Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 12: Calendrier Fête des Pères */}
      <Composition
        id="TeemDrop12"
        component={TeemDrop12}
        schema={teemDrop12Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 13: T-shirt BONNE FÊTE PAPA */}
      <Composition
        id="TeemDrop13"
        component={TeemDrop13}
        schema={teemDrop13Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />

      {/* ── TEEM DROP — Animation 14: Grille marketplace Etsy */}
      <Composition
        id="TeemDrop14"
        component={TeemDrop14}
        schema={teemDrop14Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{}}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 1: Compteur +60 000 € */}
      <Composition
        id="HighsfieldAnim01MoneyCounter"
        component={HighsfieldAnim01MoneyCounter}
        schema={highsfieldAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 7 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 2: Logo Upwork + avatars cascade */}
      <Composition
        id="HighsfieldAnim02UpworkAvatars"
        component={HighsfieldAnim02UpworkAvatars}
        schema={highsfieldAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 9 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 3: Timeline il y a 3 semaines */}
      <Composition
        id="HighsfieldAnim03Timeline"
        component={HighsfieldAnim03Timeline}
        schema={highsfieldAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ accentColor: "#ef4444", durationSecs: 9 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 4: Dissolution avatars → hexagone IA */}
      <Composition
        id="HighsfieldAnim04Dissolution"
        component={HighsfieldAnim04Dissolution}
        schema={highsfieldAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 7 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 5: Split screen Avant/Après */}
      <Composition
        id="HighsfieldAnim05SplitScreen"
        component={HighsfieldAnim05SplitScreen}
        schema={highsfieldAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{ accentColor: "#ef4444", durationSecs: 10 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 6: Liste Designers / Motion Graphics */}
      <Composition
        id="HighsfieldAnim06DesignersList"
        component={HighsfieldAnim06DesignersList}
        schema={highsfieldAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 9 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 7: Badge tampon MOINS DE 100$/MOIS */}
      <Composition
        id="HighsfieldAnim07StampBadge"
        component={HighsfieldAnim07StampBadge}
        schema={highsfieldAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ accentColor: "#ef4444", durationSecs: 7 }}
      />

      {/* ── VIDÉO HIGGSFIELD — Animation 8: Courbe coût talent descendante */}
      <Composition
        id="HighsfieldAnim08CostCurve"
        component={HighsfieldAnim08CostCurve}
        schema={highsfieldAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={450}
        defaultProps={{ accentColor: "#3060ff", durationSecs: 15 }}
      />

      {/* ── VIDÉO GENSPARK — 4 animations */}
      <Composition
        id="GenSparkAnim01SoftwareChaos"
        component={GenSparkAnim01SoftwareChaos}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
      />
      <Composition
        id="GenSparkAnim02Convergence"
        component={GenSparkAnim02Convergence}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
      />
      <Composition
        id="GenSparkAnim03Stats"
        component={GenSparkAnim03Stats}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
      />
      <Composition
        id="GenSparkAnim04Comparison"
        component={GenSparkAnim04Comparison}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
      />

      {/* ── VIDÉO RECOVERIT ── */}
      <Composition
        id="RecoverItAnim01"
        component={RecoverItAnim01}
        schema={recoverItAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim02"
        component={RecoverItAnim02}
        schema={recoverItAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim03"
        component={RecoverItAnim03}
        schema={recoverItAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim04"
        component={RecoverItAnim04}
        schema={recoverItAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim05"
        component={RecoverItAnim05}
        schema={recoverItAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim06"
        component={RecoverItAnim06}
        schema={recoverItAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim07"
        component={RecoverItAnim07}
        schema={recoverItAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim08"
        component={RecoverItAnim08}
        schema={recoverItAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim09"
        component={RecoverItAnim09}
        schema={recoverItAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="RecoverItAnim10"
        component={RecoverItAnim10}
        schema={recoverItAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{}}
      />
      {/* ── VIDÉO GENSPARK NEW — 10 animations ── */}
      <Composition
        id="GenSparkAnim05ChaosToClarity"
        component={GenSparkAnim05ChaosToClarity}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={285}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim06KineticType"
        component={GenSparkAnim06KineticType}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim07RoadmapTeaser"
        component={GenSparkAnim07RoadmapTeaser}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim08LowerThird"
        component={GenSparkAnim08LowerThird}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim09CTASubscribe"
        component={GenSparkAnim09CTASubscribe}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim10LogoReveal"
        component={GenSparkAnim10LogoReveal}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim11RadialDiagram"
        component={GenSparkAnim11RadialDiagram}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim12Counter250M"
        component={GenSparkAnim12Counter250M}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={220}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim13ComparisonRace"
        component={GenSparkAnim13ComparisonRace}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{}}
      />
      <Composition
        id="GenSparkAnim14ChapterCard"
        component={GenSparkAnim14ChapterCard}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />

      {/* ── VIDÉO HIGGS2 — 10 animations ── */}
      <Composition
        id="Higgs2Anim01FriseVieChaine"
        component={Higgs2Anim01FriseVieChaine}
        schema={higgs2Anim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          startDate: "28 juillet 2020",
          endYear: 2026,
          yearsCount: 6,
          badgeText: "100 % de mes revenus",
        }}
      />
      <Composition
        id="Higgs2Anim02ChaineProductionIA"
        component={Higgs2Anim02ChaineProductionIA}
        schema={higgs2Anim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{
          modules: [
            { label: "Script", icon: "📝" },
            { label: "Voix off", icon: "🎙️" },
            { label: "Vidéo", icon: "🎬" },
            { label: "Miniature", icon: "🖼️" },
            { label: "Publication", icon: "🚀" },
          ],
          badgeText: "0 % humain",
        }}
      />
      <Composition
        id="Higgs2Anim03Split2020vs2026"
        component={Higgs2Anim03Split2020vs2026}
        schema={higgs2Anim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          leftLabel: "2020",
          rightLabel: "2026",
          tools: [
            { name: "Claude", color: "#D97757", icon: "🧠" },
            { name: "Génération vidéo", color: "#3060ff", icon: "🎬" },
            { name: "Publication auto", color: "#22c55e", icon: "🚀" },
          ],
        }}
      />
      <Composition
        id="Higgs2Anim04CTAAbonnementCompteur"
        component={Higgs2Anim04CTAAbonnementCompteur}
        schema={higgs2Anim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{
          baseCount: 128409,
          buttonIdle: "S'abonner",
          buttonDone: "Abonné ✓",
        }}
      />
      <Composition
        id="Higgs2Anim05PodiumPlateformes"
        component={Higgs2Anim05PodiumPlateformes}
        schema={higgs2Anim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{ badgeText: "€ / 1 000 vues" }}
      />
      <Composition
        id="Higgs2Anim06AnatomieRevenuPub"
        component={Higgs2Anim06AnatomieRevenuPub}
        schema={higgs2Anim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ finalEuros: 8, finalCaption: "1 000 vues" }}
      />
      <Composition
        id="Higgs2Anim07PaliersRevenus"
        component={Higgs2Anim07PaliersRevenus}
        schema={higgs2Anim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{
          niches: ["Lifestyle", "Tech", "Make Money"],
          viewRatio: 420,
        }}
      />
      <Composition
        id="Higgs2Anim08DissolutionVisage"
        component={Higgs2Anim08DissolutionVisage}
        schema={higgs2Anim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ finalText: "Sans jamais te montrer" }}
      />
      <Composition
        id="Higgs2Anim09CerveauEtMembres"
        component={Higgs2Anim09CerveauEtMembres}
        schema={higgs2Anim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{
          centerLabel: "Claude",
          modules: [
            { label: "Générateur de script", icon: "📝" },
            { label: "Générateur de vidéo", icon: "🎬" },
            { label: "Voix", icon: "🎙️" },
            { label: "Miniature", icon: "🖼️" },
            { label: "Publication auto", icon: "🚀" },
          ],
        }}
      />
      <Composition
        id="Higgs2Anim10ClaudeVsChatGPT"
        component={Higgs2Anim10ClaudeVsChatGPT}
        schema={higgs2Anim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          leftName: "Claude",
          leftFeature: "Raisonnement long, style naturel",
          rightName: "ChatGPT",
          rightFeature: "Large écosystème d'outils",
        }}
      />

      {/* ── VIDÉO FREEBEAT — 7 animations ── */}
      <Composition
        id="FreebeatAnim01MasqueTypo2026"
        component={FreebeatAnim01MasqueTypo2026}
        schema={freebeatAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{ topWord: "BUSINESS", year: "2026" }}
      />
      <Composition
        id="FreebeatAnim02OdometreTarif"
        component={FreebeatAnim02OdometreTarif}
        schema={freebeatAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ suffix: "€", label: "par vidéo livrée" }}
      />
      <Composition
        id="FreebeatAnim03RechercheVide"
        component={FreebeatAnim03RechercheVide}
        schema={freebeatAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{
          query: "clip vidéo IA pour artiste",
          stampText: "quasi personne n'en parle",
        }}
      />
      <Composition
        id="FreebeatAnim04DelugeSorties"
        component={FreebeatAnim04DelugeSorties}
        schema={freebeatAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{ target: 120000, label: "titres publiés chaque jour" }}
      />
      <Composition
        id="FreebeatAnim05MurBudget"
        component={FreebeatAnim05MurBudget}
        schema={freebeatAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          label1: "Clip vidéo classique",
          value1: "5 000 € – 30 000 €",
          label2: "Budget d'un artiste indé",
          value2: "200 €",
          bracketText: "l'écart où tu te places",
        }}
      />
      <Composition
        id="FreebeatAnim06ChaineProduction"
        component={FreebeatAnim06ChaineProduction}
        schema={freebeatAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{
          steps: [
            { label: "Le son de l'artiste", icon: "🎵" },
            { label: "Le prompt", icon: "✍️" },
            { label: "Images IA", icon: "🖼️" },
            { label: "Montage", icon: "🎬" },
            { label: "Clip livré", icon: "📦" },
          ],
        }}
      />
      <Composition
        id="FreebeatAnim07WipeAvantApres"
        component={FreebeatAnim07WipeAvantApres}
        schema={freebeatAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          leftLabel: "Tournage classique",
          rightLabel: "Généré par IA",
          stampText: "100 % généré par IA",
        }}
      />

      {/* ════════════════════════════════════════════════
          VIDÉO HIGGS — 9 ANIMATIONS (influenceur IA)
          ════════════════════════════════════════════════ */}
      <Composition
        id="HiggsAnim01DesintegrationPixels"
        component={HiggsAnim01DesintegrationPixels}
        schema={higgsAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={96}
        defaultProps={{ text: "N'EXISTE PAS", portraitSrc: undefined }}
      />
      <Composition
        id="HiggsAnim02Compteur40Minutes"
        component={HiggsAnim02Compteur40Minutes}
        schema={higgsAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={105}
        defaultProps={{
          targetMinutes: 40,
          unit: "MINUTES",
          compareLabel: "Shooting photo classique",
          compareTime: "3 semaines",
          compareCost: "2 400 €",
        }}
      />
      <Composition
        id="HiggsAnim03RailAtoZ"
        component={HiggsAnim03RailAtoZ}
        schema={higgsAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          steps: ["Créer le visage", "Générer le contenu", "Faire parler", "Monétiser"],
        }}
      />
      <Composition
        id="HiggsAnim04WipeDiagonal"
        component={HiggsAnim04WipeDiagonal}
        schema={higgsAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={{ leftLabel: "LE CRÉER", rightLabel: "LE MONÉTISER" }}
      />
      <Composition
        id="HiggsAnim05LigneTemps2020"
        component={HiggsAnim05LigneTemps2020}
        schema={higgsAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{
          years: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
          centerYear: 2026,
          finalText: "6 ANS SUR INTERNET",
        }}
      />
      <Composition
        id="HiggsAnim06BarreAbonnement"
        component={HiggsAnim06BarreAbonnement}
        schema={higgsAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={84}
        defaultProps={{ idleLabel: "S'ABONNER", doneLabel: "ABONNÉ" }}
      />
      <Composition
        id="HiggsAnim07TuyauxRevenus"
        component={HiggsAnim07TuyauxRevenus}
        schema={higgsAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ finalValue: 4200, suffix: " €" }}
      />
      <Composition
        id="HiggsAnim08MurDeVerre"
        component={HiggsAnim08MurDeVerre}
        schema={higgsAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          line1: "Ils veulent se lancer.",
          line2: "Ils ne veulent pas se montrer.",
        }}
      />
      <Composition
        id="HiggsAnim09MasqueRevelateur"
        component={HiggsAnim09MasqueRevelateur}
        schema={higgsAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={105}
        defaultProps={{ faceSrc: undefined }}
      />

      {/* ════════════════════════════════════════════════
          VIDÉO HIGGS ADOBE — 10 ANIMATIONS
          (l'IA + Adobe Premiere Pro remplacent le monteur vidéo)
          ════════════════════════════════════════════════ */}
      <Composition
        id="HiggsAdobeAnim01Courbe3Ans"
        component={HiggsAdobeAnim01Courbe3Ans}
        schema={higgsAdobeAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ milestones: ["2023", "2024", "2025", "2026"] }}
      />
      <Composition
        id="HiggsAdobeAnim02QuestionsConvergent"
        component={HiggsAdobeAnim02QuestionsConvergent}
        schema={higgsAdobeAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ question: "L'IA va-t-elle remplacer les monteurs vidéo ?" }}
      />
      <Composition
        id="HiggsAdobeAnim03TimelineRemplissage"
        component={HiggsAdobeAnim03TimelineRemplissage}
        schema={higgsAdobeAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{ target: 78, unit: "%" }}
      />
      <Composition
        id="HiggsAdobeAnim04MosaiqueScan"
        component={HiggsAdobeAnim04MosaiqueScan}
        schema={higgsAdobeAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAdobeAnim05Cassure"
        component={HiggsAdobeAnim05Cassure}
        schema={higgsAdobeAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={{ word: "LACUNES" }}
      />
      <Composition
        id="HiggsAdobeAnim06AvantMaintenant"
        component={HiggsAdobeAnim06AvantMaintenant}
        schema={higgsAdobeAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={285}
        defaultProps={{
          leftHeader: "MONTEUR VIDÉO",
          rightHeader: "IA",
          tasks: ["Sous-titres", "Découpe des silences", "Étalonnage", "Transitions", "Sound design"],
        }}
      />
      <Composition
        id="HiggsAdobeAnim07DeuxProfils"
        component={HiggsAdobeAnim07DeuxProfils}
        schema={higgsAdobeAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          card1: { label: "CRÉATEUR", value: 12, unit: "h / semaine", caption: "de temps libéré" },
          card2: { label: "PRESTATAIRE", value: 2400, unit: "$ / mois", caption: "de revenu en plus" },
        }}
      />
      <Composition
        id="HiggsAdobeAnim08BarreProgression"
        component={HiggsAdobeAnim08BarreProgression}
        schema={higgsAdobeAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={90}
        defaultProps={{ fillPercent: 15 }}
      />
      <Composition
        id="HiggsAdobeAnim09StackAssemblage"
        component={HiggsAdobeAnim09StackAssemblage}
        schema={higgsAdobeAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ premiereLogo: "higgs-adobe/premiere-pro.png", pluginLabel: "PLUGIN IA" }}
      />
      <Composition
        id="HiggsAdobeAnim10TamponReference"
        component={HiggsAdobeAnim10TamponReference}
        schema={higgsAdobeAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ topText: "STANDARD DE", bottomText: "L'INDUSTRIE" }}
      />

      {/* ════════════════════════════════════════════════
          VIDÉO PDFELEMENT — 10 ANIMATIONS
          (analyser un contrat avec l'IA — fonctionnalité Agreement de PDFelement v13)
          ════════════════════════════════════════════════ */}
      <Composition
        id="PdfelementAnim01ScanContratHook"
        component={PdfelementAnim01ScanContratHook}
        schema={pdfelementAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          clauses: [
            { label: "Clause de non-concurrence", yPct: 0.35 },
            { label: "Pénalité 15 %", yPct: 0.55 },
            { label: "Renouvellement automatique", yPct: 0.75 },
          ],
          badgeStartFrames: [30, 55, 80],
        }}
      />
      <Composition
        id="PdfelementAnim02LoupePetitsCaracteres"
        component={PdfelementAnim02LoupePetitsCaracteres}
        schema={pdfelementAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ trapSentence: "Le prestataire renonce à tout recours" }}
      />
      <Composition
        id="PdfelementAnim03CourseIAVsManuel"
        component={PdfelementAnim03CourseIAVsManuel}
        schema={pdfelementAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          manualLabel: "À LA MAIN",
          aiLabel: "AVEC L'IA",
          manualSeconds: 2700,
          aiSeconds: 90,
        }}
      />
      <Composition
        id="PdfelementAnim04UpgradeVersion13Badge"
        component={PdfelementAnim04UpgradeVersion13Badge}
        schema={pdfelementAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{
          fromVersion: 12,
          toVersion: 13,
          badgeTag: "NOUVEAU",
          badgeName: "Agreement",
        }}
      />
      <Composition
        id="PdfelementAnim05QuatreProfilsGrid"
        component={PdfelementAnim05QuatreProfilsGrid}
        schema={pdfelementAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{
          profiles: [
            { name: "Freelance", emoji: "💼" },
            { name: "Entrepreneur", emoji: "🚀" },
            { name: "Étudiant", emoji: "🎓" },
            { name: "Salarié", emoji: "🏢" },
          ],
        }}
      />
      <Composition
        id="PdfelementAnim06CarrouselContratsPerspective"
        component={PdfelementAnim06CarrouselContratsPerspective}
        schema={pdfelementAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          contracts: [
            { title: "Contrat de service", emoji: "🤝" },
            { title: "Contrat de travail", emoji: "💼" },
            { title: "Contrat fournisseur", emoji: "🚚" },
          ],
        }}
      />
      <Composition
        id="PdfelementAnim07BarreOutilsAllumage"
        component={PdfelementAnim07BarreOutilsAllumage}
        schema={pdfelementAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{
          tools: [
            { start: 12, emoji: "✏️", label: "Éditer le texte", extraScale: 1.25, damping: 8, rotate: false },
            { start: 51, emoji: "📐", label: "Modifier la mise en page", extraScale: 1.3, damping: 6, rotate: false },
            { start: 90, emoji: "🔄", label: "Convertir", extraScale: 1.25, damping: 8, rotate: true },
          ],
        }}
      />
      <Composition
        id="PdfelementAnim08RadarDetectionIA"
        component={PdfelementAnim08RadarDetectionIA}
        schema={pdfelementAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          markers: [
            { label: "Risque élevé", x: 700, y: 340, lx: 300, ly: 170 },
            { label: "Date limite", x: 1270, y: 380, lx: 1620, ly: 170 },
            { label: "Montant", x: 630, y: 730, lx: 300, ly: 930 },
            { label: "Résiliation", x: 1250, y: 770, lx: 1620, ly: 930 },
          ],
        }}
      />
      <Composition
        id="PdfelementAnim09DisclaimerAvocat"
        component={PdfelementAnim09DisclaimerAvocat}
        schema={pdfelementAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ message: "Ne remplace pas un avocat", stampText: "Avertissement" }}
      />
      <Composition
        id="PdfelementAnim10TransitionTutoriel"
        component={PdfelementAnim10TransitionTutoriel}
        schema={pdfelementAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={60}
        defaultProps={{ word: "TUTORIEL" }}
      />

      {/* ════════════════════════════════════════════════
          VIDÉO MAXDROP — 17 ANIMATIONS
          (marché des compléments alimentaires / marque blanche — sponsor Max Dropshipping)
          ════════════════════════════════════════════════ */}
      <Composition
        id="MaxdropAnim01CompteurEchelle"
        component={MaxdropAnim01CompteurEchelle}
        schema={maxdropAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          target: 3_000_000_000,
          currency: "€",
          subtitle: "Marché européen des compléments alimentaires — 2025",
        }}
      />
      <Composition
        id="MaxdropAnim02Duel2018vs2025"
        component={MaxdropAnim02Duel2018vs2025}
        schema={maxdropAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          leftYear: "2018",
          rightYear: "2025",
          leftPct: 46,
          rightPct: 61,
          deltaLabel: "+15 points en 7 ans",
        }}
      />
      <Composition
        id="MaxdropAnim03EliminationSuspects"
        component={MaxdropAnim03EliminationSuspects}
        schema={maxdropAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{ suspects: ["IA", "CRYPTO", "DROPSHIPPING CLASSIQUE"] }}
      />
      <Composition
        id="MaxdropAnim04BoucleRachat"
        component={MaxdropAnim04BoucleRachat}
        schema={maxdropAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{
          mainLabel: "Taux de rachat le plus élevé",
          subLabel: "du e-commerce",
          buyWord: "Achat n°",
        }}
      />
      <Composition
        id="MaxdropAnim05TroisSans"
        component={MaxdropAnim05TroisSans}
        schema={maxdropAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{
          items: [
            { icon: "factory", text: "Sans usine" },
            { icon: "warehouse", text: "Sans stock" },
            { icon: "cash", text: "Sans gros budget" },
          ],
        }}
      />
      <Composition
        id="MaxdropAnim06ConstructionBouteille"
        component={MaxdropAnim06ConstructionBouteille}
        schema={maxdropAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ labelText: "COMPLÉMENTS ALIMENTAIRES" }}
      />
      <Composition
        id="MaxdropAnim07CourbeDecolle"
        component={MaxdropAnim07CourbeDecolle}
        schema={maxdropAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{
          years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
          calloutText: "3 Md€ (France seule)",
          covidLabel: "COVID",
        }}
      />
      <Composition
        id="MaxdropAnim08CausesSobre"
        component={MaxdropAnim08CausesSobre}
        schema={maxdropAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={360}
        defaultProps={{
          centerText: "Pourquoi maintenant ?",
          branches: ["Stress", "Fatigue", "Sommeil", "Santé mentale"],
        }}
      />
      <Composition
        id="MaxdropAnim09MurDevientFosse"
        component={MaxdropAnim09MurDevientFosse}
        schema={maxdropAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={480}
        defaultProps={{
          wallLabel: "Réglementation UE",
          abandonLabel: "99% abandonnent",
          advantageLabel: "Moins de concurrence pour ceux qui passent",
        }}
      />
      <Composition
        id="MaxdropAnim10MecaniqueMarqueBlanche"
        component={MaxdropAnim10MecaniqueMarqueBlanche}
        schema={maxdropAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={390}
        defaultProps={{
          topLabel: "LE PARTENAIRE",
          bottomLabel: "TOI",
          stamps: ["Certifié UE", "Formule validée", "Fabrication"],
          bottomSteps: ["Ton logo", "Ton étiquette", "Ton carton"],
          finalText: "Ta marque.",
        }}
      />
      <Composition
        id="MaxdropAnim11PartageDesTaches"
        component={MaxdropAnim11PartageDesTaches}
        schema={maxdropAnim11Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={420}
        defaultProps={{
          leftLabel: "TOI",
          rightLabel: "MAX DROPSHIPPING",
          cards: [
            { label: "Logo", side: "left" },
            { label: "Certifications", side: "right" },
            { label: "Branding", side: "left" },
            { label: "Fabrication", side: "right" },
            { label: "Site internet", side: "left" },
            { label: "Packaging", side: "right" },
            { label: "Marketing", side: "left" },
            { label: "Logistique", side: "right" },
          ],
          leftFootnote: "Ce que tu contrôles",
          rightFootnote: "Ce qu'ils gèrent pour toi",
        }}
      />
      <Composition
        id="MaxdropAnim12ReseauMondial"
        component={MaxdropAnim12ReseauMondial}
        schema={maxdropAnim12Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{ counterTarget: 10000, counterLabel: "marques e-commerce" }}
      />
      <Composition
        id="MaxdropAnim13Timeline10Jours"
        component={MaxdropAnim13Timeline10Jours}
        schema={maxdropAnim13Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={360}
        defaultProps={{
          milestones: [
            { label: "Choix de la formule", emoji: "🧪", frac: 0.06, appear: 40 },
            { label: "Envoi du branding", emoji: "🎨", frac: 0.22, appear: 115 },
            { label: "Impression packaging", emoji: "📦", frac: 0.5, appear: 190 },
            { label: "Produit prêt", emoji: "✅", frac: 1, appear: 265 },
          ],
          finalText: "10 jours.",
        }}
      />
      <Composition
        id="MaxdropAnim14ChuteDuMOQ"
        component={MaxdropAnim14ChuteDuMOQ}
        schema={maxdropAnim14Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{
          classicLabel: "Fournisseur classique",
          moqLabel: "MOQ 1 000 unités",
          maxLabel: "Max Dropshipping",
          noMinLabel: "Pas de minimum.",
        }}
      />
      <Composition
        id="MaxdropAnim15LaboFormulation"
        component={MaxdropAnim15LaboFormulation}
        schema={maxdropAnim15Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={390}
        defaultProps={{
          ingredients: ["Vitamine D", "Magnésium", "Zinc", "Ashwagandha"],
          stampText: "Approuvé UE",
          finalText: "Formule sur-mesure : 15 jours et +",
        }}
      />
      <Composition
        id="MaxdropAnim16CarrouselFormats"
        component={MaxdropAnim16CarrouselFormats}
        schema={maxdropAnim16Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={360}
        defaultProps={{
          formats: [
            { label: "Capsules", emoji: "💊" },
            { label: "Tablettes", emoji: "🟠" },
            { label: "Poudre", emoji: "🥄" },
            { label: "Gummies", emoji: "🐻" },
            { label: "Energy drink", emoji: "🥤" },
          ],
          finalText: "Tous les formats.",
        }}
      />
      <Composition
        id="MaxdropAnim17CTAFinal"
        component={MaxdropAnim17CTAFinal}
        schema={maxdropAnim17Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{ linkText: "🔗 Max Dropshipping — lien en description" }}
      />

      {/* ── VIDÉO HIGGS BLEN — 8 ANIMATIONS (apprendre Blender avec l'IA) ── */}
      <Composition
        id="HiggsBlenAnim01MurRendus"
        component={HiggsBlenAnim01MurRendus}
        schema={higgsBlenAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          renderTiles: [],
          stampText: "100 % Blender",
          stampSubText: "0 heure d'expérience",
        }}
      />
      <Composition
        id="HiggsBlenAnim02FicheVide"
        component={HiggsBlenAnim02FicheVide}
        schema={higgsBlenAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{
          header: "Fiche compétence",
          counterLabel: "Heures sur Blender",
          criteria: [
            "Jamais installé le logiciel",
            "Jamais ouvert un tutoriel",
            "Aucune formation suivie",
          ],
          stampText: "Débutant total",
        }}
      />
      <Composition
        id="HiggsBlenAnim03ChaosRange"
        component={HiggsBlenAnim03ChaosRange}
        schema={higgsBlenAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{
          prompt: "crée-moi un donut réaliste en 3D",
          leftTitle: "Interface professionnelle",
          rightTitle: "Toi",
          buttonLabel: "Générer",
        }}
      />
      <Composition
        id="HiggsBlenAnim04Odometre"
        component={HiggsBlenAnim04Odometre}
        schema={higgsBlenAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={285}
        defaultProps={{
          offers: [
            { poste: "Artiste 3D", studio: "Studio Nordic 3D", tarif: "3 800 €/mois" },
            { poste: "Motion Designer", studio: "Atelier Motion", tarif: "650 €/jour" },
            { poste: "Character Artist", studio: "PixelForge Games", tarif: "4 200 €/mois" },
            { poste: "Générateur d'assets 3D", studio: "Freelance Hub", tarif: "1 200 €/projet" },
            { poste: "Environment Artist", studio: "Northlight Studio", tarif: "3 500 €/mois" },
            { poste: "Lookdev / Shading", studio: "Atelier Rendu", tarif: "700 €/jour" },
            { poste: "Rigger 3D", studio: "Marionette FX", tarif: "3 900 €/mois" },
            { poste: "Hard Surface Artist", studio: "ForgeWorks", tarif: "4 100 €/mois" },
            { poste: "Archviz 3D", studio: "Studio Perspective", tarif: "2 800 €/mois" },
            { poste: "Prop Artist", studio: "Handmade Assets", tarif: "600 €/jour" },
          ],
          heroSalary: "3800",
          heroUnit: "€/mois",
          heroPoste: "Artiste 3D",
          heroStudio: "Studio Nordic 3D",
        }}
      />
      <Composition
        id="HiggsBlenAnim05Constellation"
        component={HiggsBlenAnim05Constellation}
        schema={higgsBlenAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{
          centerLabel: "Blender",
          branches: [
            "Jeux vidéo",
            "Films d'animation",
            "Pub & VFX",
            "Architecture 3D",
            "Produit & packaging",
          ],
        }}
      />
      <Composition
        id="HiggsBlenAnim06DeuxCourbes"
        component={HiggsBlenAnim06DeuxCourbes}
        schema={higgsBlenAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          xLabel: "Temps",
          yLabel: "Niveau",
          redTitle: "Apprendre seul",
          redValue: "2 ans",
          greenTitle: "Avec l'IA",
          greenValue: "1 après-midi",
        }}
      />
      <Composition
        id="HiggsBlenAnim07CarteIdentite"
        component={HiggsBlenAnim07CarteIdentite}
        schema={higgsBlenAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{
          name: "Ibrahim Camara",
          tagline: "Compétences pour gagner de l'argent en ligne",
          subscribeLabel: "S'abonner",
        }}
      />
      <Composition
        id="HiggsBlenAnim08BandeauUnivers"
        component={HiggsBlenAnim08BandeauUnivers}
        schema={higgsBlenAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          row1: [],
          row2: [],
          row3: [],
          heroWord: "La référence",
          subtitle: "Studios, jeux vidéo, films d'animation",
        }}
      />

      {/* ── VIDÉO HIGGS GPT — 8 ANIMATIONS (GPT-6 Astra + l'outil mystère) ── */}
      <Composition
        id="HiggsGptAnim01Rembobinage"
        component={HiggsGptAnim01Rembobinage}
        schema={higgsGptAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ badgeText: "100 % GPT-6 Astra" }}
      />
      <Composition
        id="HiggsGptAnim02EquationIncomplete"
        component={HiggsGptAnim02EquationIncomplete}
        schema={higgsGptAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          astraLabel: "GPT-6 Astra",
          slotLabel: "?",
          resultLabel: "La vidéo",
        }}
      />
      <Composition
        id="HiggsGptAnim03TroisVerrous"
        component={HiggsGptAnim03TroisVerrous}
        schema={higgsGptAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{ numbers: ["01", "02", "03"] }}
      />
      <Composition
        id="HiggsGptAnim04RampeDates"
        component={HiggsGptAnim04RampeDates}
        schema={higgsGptAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          days: ["1", "2", "3", "4", "5", "6", "7"],
          releaseLabel: "SORTIE OFFICIELLE",
          todayLabel: "AUJOURD'HUI",
        }}
      />
      <Composition
        id="HiggsGptAnim05MurSuperlatifs"
        component={HiggsGptAnim05MurSuperlatifs}
        schema={higgsGptAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{
          banners: [
            "LE MODÈLE LE PLUS PUISSANT JAMAIS CRÉÉ",
            "UNE RÉVOLUTION SANS PRÉCÉDENT",
            "DES CAPACITÉS INÉGALÉES",
            "LE PLUS AVANCÉ DE L'HISTOIRE",
            "UNE PERFORMANCE HISTORIQUE",
            "JAMAIS VU AUPARAVANT",
            "UN BOND TECHNOLOGIQUE MAJEUR",
          ],
          stampText: "Baratin",
        }}
      />
      <Composition
        id="HiggsGptAnim06CarteAbonnement"
        component={HiggsGptAnim06CarteAbonnement}
        schema={higgsGptAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{
          planName: "GPT-6 Astra",
          planSub: "ChatGPT Plus",
          unlimitedLabel: "ILLIMITÉ",
        }}
      />
      <Composition
        id="HiggsGptAnim07BazookaCrepe"
        component={HiggsGptAnim07BazookaCrepe}
        schema={higgsGptAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={300}
        defaultProps={{
          leftQuestion: "Comment faire des crêpes ?",
          rightLabel: "Raisonnement complexe",
        }}
      />
      <Composition
        id="HiggsGptAnim08PlafondVerre"
        component={HiggsGptAnim08PlafondVerre}
        schema={higgsGptAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{ word: "LIMITATIONS" }}
      />

      {/* ── VIDÉO HIGGS GPT 6 · 2 — 9 animations (Astra construit une chaîne) ── */}
      <Composition
        id="HiggsGpt2Anim01ChaineQuiSeConstruit"
        component={HiggsGpt2Anim01ChaineQuiSeConstruit}
        schema={higgsGpt2Anim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          channelName: "Ma Chaîne YouTube",
          subscribeLabel: "S'abonner",
          subCountLabel: "0 abonnés",
        }}
      />
      <Composition
        id="HiggsGpt2Anim02ChaineProduction3Maillons"
        component={HiggsGpt2Anim02ChaineProduction3Maillons}
        schema={higgsGpt2Anim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{ titles: ["NICHE", "SCRIPT + VIDÉO", "PUBLICATION"] }}
      />
      <Composition
        id="HiggsGpt2Anim03CompteurEffortZero"
        component={HiggsGpt2Anim03CompteurEffortZero}
        schema={higgsGpt2Anim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{ label: "Ton travail" }}
      />
      <Composition
        id="HiggsGpt2Anim04BarreProgressionChapitres"
        component={HiggsGpt2Anim04BarreProgressionChapitres}
        schema={higgsGpt2Anim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ anticipationText: "la partie la plus importante" }}
      />
      <Composition
        id="HiggsGpt2Anim05CarteAbonnementFlip"
        component={HiggsGpt2Anim05CarteAbonnementFlip}
        schema={higgsGpt2Anim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{
          planName: "ChatGPT Pro",
          price: 20,
          benefits: [
            "Accès à GPT-6 Astra",
            "Extension Higgsfield compatible",
            "Génération illimitée",
          ],
        }}
      />
      <Composition
        id="HiggsGpt2Anim06DeverrouillageModele"
        component={HiggsGpt2Anim06DeverrouillageModele}
        schema={higgsGpt2Anim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ models: ["GPT-5", "GPT-5.2", "GPT-6", "GPT-6 Astra"] }}
      />
      <Composition
        id="HiggsGpt2Anim07ModuleClipse"
        component={HiggsGpt2Anim07ModuleClipse}
        schema={higgsGpt2Anim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ gainLabel: "+300% de capacités" }}
      />
      <Composition
        id="HiggsGpt2Anim08MosaiqueCapacites"
        component={HiggsGpt2Anim08MosaiqueCapacites}
        schema={higgsGpt2Anim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{
          labels: ["Vidéos IA", "Photos IA", "Animations IA", "Films réalistes"],
        }}
      />
      <Composition
        id="HiggsGpt2Anim09FlecheDescription"
        component={HiggsGpt2Anim09FlecheDescription}
        schema={higgsGpt2Anim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ text: "Lien dans la description" }}
      />

      {/* ── VIDÉO HIGGS GPT 6 · 3 — 7 animations (maison IA + méthode immobilier 2026) ── */}
      <Composition
        id="HiggsGpt3Anim01ScanMetadonnees"
        component={HiggsGpt3Anim01ScanMetadonnees}
        schema={higgsGpt3Anim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{
          model: "nano banana pro",
          prompt: "villa moderne, golden hour",
          cost: "0,03 €",
          stamp: "100 % GÉNÉRÉ PAR IA",
        }}
      />
      <Composition
        id="HiggsGpt3Anim02RailAZ"
        component={HiggsGpt3Anim02RailAZ}
        schema={higgsGpt3Anim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={204}
        defaultProps={{
          station1: "Générer les images",
          station2: "Animer les plans",
          station3: "Monétiser",
        }}
      />
      <Composition
        id="HiggsGpt3Anim03DoubleColonneBudget"
        component={HiggsGpt3Anim03DoubleColonneBudget}
        schema={higgsGpt3Anim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ leftTotal: 1200, rightTotal: 15, delta: "-98%" }}
      />
      <Composition
        id="HiggsGpt3Anim04CarteIdentite"
        component={HiggsGpt3Anim04CarteIdentite}
        schema={higgsGpt3Anim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          name: "Ibrahim Camara",
          activity: "Business en ligne depuis 2020",
          company: "Nova Media Lab",
        }}
      />
      <Composition
        id="HiggsGpt3Anim05MosaiqueMiniatures"
        component={HiggsGpt3Anim05MosaiqueMiniatures}
        schema={higgsGpt3Anim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ channelInitials: "IC" }}
      />
      <Composition
        id="HiggsGpt3Anim06JaugeAbonnement"
        component={HiggsGpt3Anim06JaugeAbonnement}
        schema={higgsGpt3Anim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{
          channelInitials: "IC",
          subscribeLabel: "S'ABONNER",
          subscribedLabel: "ABONNÉ",
          subCount: 48200,
        }}
      />
      <Composition
        id="HiggsGpt3Anim07AssemblagePipeline"
        component={HiggsGpt3Anim07AssemblagePipeline}
        schema={higgsGpt3Anim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          block1: "Génération d'images",
          block2: "Animation",
          block3: "Voix off",
          block4: "Montage final",
        }}
      />

      {/* ── VIDÉO HIGGS AFTER — 9 animations (IA + After Effects) ── */}
      <Composition
        id="HiggsAfterAnim01SplitEchec"
        component={HiggsAfterAnim01SplitEchec}
        schema={higgsAfterAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim02EquationIAAE"
        component={HiggsAfterAnim02EquationIAAE}
        schema={higgsAfterAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim03DeuxPiliers"
        component={HiggsAfterAnim03DeuxPiliers}
        schema={higgsAfterAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim04MosaiqueZoom"
        component={HiggsAfterAnim04MosaiqueZoom}
        schema={higgsAfterAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim05CourbeDifficulte"
        component={HiggsAfterAnim05CourbeDifficulte}
        schema={higgsAfterAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim06ChecklistFloutee"
        component={HiggsAfterAnim06ChecklistFloutee}
        schema={higgsAfterAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim07CarteAbonnementOdometre"
        component={HiggsAfterAnim07CarteAbonnementOdometre}
        schema={higgsAfterAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim08MorphFenetre"
        component={HiggsAfterAnim08MorphFenetre}
        schema={higgsAfterAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsAfterAnim09SchemaConnexion"
        component={HiggsAfterAnim09SchemaConnexion}
        schema={higgsAfterAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />

      {/* ── VIDÉO PIPPIT — 6 animations ── */}
      <Composition
        id="PippitAnim01FicheDictionnaire"
        component={PippitAnim01FicheDictionnaire}
        schema={pippitAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{
          word: "af·fi·li·a·tion",
          pos: "(n.f.)",
          definitionWords: ["Promouvoir", "un", "produit", "ou", "un", "service"],
          highlightedWord: "Promouvoir",
        }}
      />
      <Composition
        id="PippitAnim02CircuitCommission"
        component={PippitAnim02CircuitCommission}
        schema={pippitAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ amount: 30 }}
      />
      <Composition
        id="PippitAnim03TamponPasBesoin"
        component={PippitAnim03TamponPasBesoin}
        schema={pippitAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ stampText: "PAS BESOIN" }}
      />
      <Composition
        id="PippitAnim04MorphingOrdiTelephone"
        component={PippitAnim04MorphingOrdiTelephone}
        schema={pippitAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={{ finalText: "C'est tout." }}
      />
      <Composition
        id="PippitAnim05DeflouCompteurZero"
        component={PippitAnim05DeflouCompteurZero}
        schema={pippitAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{ imageSrc: "", subscriberCount: 1250000 }}
      />
      <Composition
        id="PippitAnim06AbsorptionIA"
        component={PippitAnim06AbsorptionIA}
        schema={pippitAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{ labels: ["Script", "Visuels", "Voix", "Montage"], brandName: "pipit.ai" }}
      />

      {/* ── VIDÉO HIGGS MARKETING — 10 animations (vendre des vidéos IA personnalisées) ── */}
      <Composition
        id="HiggsMarketingAnim01EtiquettePrix"
        component={HiggsMarketingAnim01EtiquettePrix}
        schema={higgsMarketingAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ labelText: "Vidéo perso", stampText: "VENDU" }}
      />
      <Composition
        id="HiggsMarketingAnim02CourbeSaison"
        component={HiggsMarketingAnim02CourbeSaison}
        schema={higgsMarketingAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ title: "Demande de vidéos personnalisées", peakLabel: "Noël" }}
      />
      <Composition
        id="HiggsMarketingAnim03CircuitArgent"
        component={HiggsMarketingAnim03CircuitArgent}
        schema={higgsMarketingAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ parentLabel: "Parent", selfLabel: "Toi", childLabel: "Enfant" }}
      />
      <Composition
        id="HiggsMarketingAnim04MurOffres"
        component={HiggsMarketingAnim04MurOffres}
        schema={higgsMarketingAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{ finalTitle: "Vidéo perso du Père Noël", finalPrice: "25 €" }}
      />
      <Composition
        id="HiggsMarketingAnim05MachinePrenoms"
        component={HiggsMarketingAnim05MachinePrenoms}
        schema={higgsMarketingAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={{ finalName: "Aïcha", saleCount: 47 }}
      />
      <Composition
        id="HiggsMarketingAnim06ImplosionOutils"
        component={HiggsMarketingAnim06ImplosionOutils}
        schema={higgsMarketingAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ finalTool: "ChatGPT", finalMessage: "1 seul outil" }}
      />
      <Composition
        id="HiggsMarketingAnim07TerminalWhoami"
        component={HiggsMarketingAnim07TerminalWhoami}
        schema={higgsMarketingAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ name: "Ibrahim Camara", year: "2020" }}
      />
      <Composition
        id="HiggsMarketingAnim08BoutonPhysique"
        component={HiggsMarketingAnim08BoutonPhysique}
        schema={higgsMarketingAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{ subscribeLabel: "Abonné" }}
      />
      <Composition
        id="HiggsMarketingAnim09CadenasModele"
        component={HiggsMarketingAnim09CadenasModele}
        schema={higgsMarketingAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{ modelName: "GPT-6 Astra" }}
      />
      <Composition
        id="HiggsMarketingAnim10BalanceRentabilite"
        component={HiggsMarketingAnim10BalanceRentabilite}
        schema={higgsMarketingAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{ costLabel: "20 €/mois", saleLabel: "1 vidéo vendue", resultLabel: "Rentable" }}
      />
      <Composition
        id="HiggsApiAnim01PlanArchitecte"
        component={HiggsApiAnim01PlanArchitecte}
        schema={higgsApiAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim02ProliferationLogiciels"
        component={HiggsApiAnim02ProliferationLogiciels}
        schema={higgsApiAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim03ReleveBancaire"
        component={HiggsApiAnim03ReleveBancaire}
        schema={higgsApiAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={270}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim04BalayageProfils"
        component={HiggsApiAnim04BalayageProfils}
        schema={higgsApiAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim05BasculePrix"
        component={HiggsApiAnim05BasculePrix}
        schema={higgsApiAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim06DeuxEmplacements"
        component={HiggsApiAnim06DeuxEmplacements}
        schema={higgsApiAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={255}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim07MurGeneration"
        component={HiggsApiAnim07MurGeneration}
        schema={higgsApiAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim08OutilBrique"
        component={HiggsApiAnim08OutilBrique}
        schema={higgsApiAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={225}
        defaultProps={{}}
      />
      <Composition
        id="HiggsApiAnim09TuyauAPI"
        component={HiggsApiAnim09TuyauAPI}
        schema={higgsApiAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={330}
        defaultProps={{}}
      />
      <Composition
        id="HiggsOpusAnim01PelliculeFilm"
        component={HiggsOpusAnim01PelliculeFilm}
        schema={higgsOpusAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={{
          promptText: "Crée un court métrage cinématique sur le lancement d'Opus 5.5",
          badgeText: "Opus 5.5",
          summaryText: "1 PROMPT = 1 FILM",
        }}
      />
      <Composition
        id="HiggsOpusAnim02SchemaConnexionMCP"
        component={HiggsOpusAnim02SchemaConnexionMCP}
        schema={higgsOpusAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={{
          opusLabel: "Opus 5.5",
          mcpLabel: "MCP",
          higgsfieldLabel: "Higgsfield",
          footerText: "Généré automatiquement",
        }}
      />
      <Composition
        id="HiggsOpusAnim03RoadmapEtapes"
        component={HiggsOpusAnim03RoadmapEtapes}
        schema={higgsOpusAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={{
          steps: ["Le prompt", "La connexion MCP", "La génération", "Le résultat"],
          finalBadge: "RÉPLICABLE PAR TOI AUSSI",
        }}
      />
      <Composition
        id="HiggsOpusAnim04CalendrierSeptembre"
        component={HiggsOpusAnim04CalendrierSeptembre}
        schema={higgsOpusAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={105}
        defaultProps={{
          days: ["18", "19", "20", "21", "22"],
          month: "SEPT",
          stampText: "NOUVEAU",
        }}
      />
      <Composition
        id="HiggsOpusAnim05BalanceCoutCredits"
        component={HiggsOpusAnim05BalanceCoutCredits}
        schema={higgsOpusAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={{
          fableLabel: "Fable",
          opusLabel: "Opus 5.5",
          powerTitle: "PUISSANCE",
          costTitle: "COÛT EN CRÉDITS",
          gapText: "BEAUCOUP MOINS CHER",
        }}
      />
      <Composition
        id="HiggsOpusAnim06PromesseRealite"
        component={HiggsOpusAnim06PromesseRealite}
        schema={higgsOpusAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={{
          title: "Ce qu'Anthropic annonce",
          points: ["Aussi puissant que Fable", "Moins cher en crédits"],
          testLabel: "À TESTER",
        }}
      />
      <Composition
        id="HiggsOpusAnim07CtaAbonnementPouce"
        component={HiggsOpusAnim07CtaAbonnementPouce}
        schema={higgsOpusAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={135}
        defaultProps={{
          subscribeLabel: "S'ABONNER",
          subscribedLabel: "ABONNÉ",
        }}
      />
      <Composition
        id="HiggsOpusAnim08TransitionWipe"
        component={HiggsOpusAnim08TransitionWipe}
        schema={higgsOpusAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={36}
        defaultProps={{}}
      />
      <Composition
        id="AisaAnim01RapportFlip3D"
        component={AisaAnim01RapportFlip3D}
        schema={aisaAnim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={aisaAnim01Schema.parse({})}
      />
      <Composition
        id="AisaAnim02OrbiteMoteursIA"
        component={AisaAnim02OrbiteMoteursIA}
        schema={aisaAnim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={aisaAnim02Schema.parse({})}
      />
      <Composition
        id="AisaAnim03ConversationRestaurants"
        component={AisaAnim03ConversationRestaurants}
        schema={aisaAnim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={aisaAnim03Schema.parse({})}
      />
      <Composition
        id="AisaAnim04SourcesVersNoyauIA"
        component={AisaAnim04SourcesVersNoyauIA}
        schema={aisaAnim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={aisaAnim04Schema.parse({})}
      />
      <Composition
        id="AisaAnim05ClassementRemontee"
        component={AisaAnim05ClassementRemontee}
        schema={aisaAnim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={aisaAnim05Schema.parse({})}
      />
      <Composition
        id="AisaAnim06GlobeUtilisateurs"
        component={AisaAnim06GlobeUtilisateurs}
        schema={aisaAnim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={aisaAnim06Schema.parse({})}
      />
      <Composition
        id="AisaAnim07RecherchesQuotidien"
        component={AisaAnim07RecherchesQuotidien}
        schema={aisaAnim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={240}
        defaultProps={aisaAnim07Schema.parse({})}
      />
      <Composition
        id="AisaAnim08BalanceGoogleVsIA"
        component={AisaAnim08BalanceGoogleVsIA}
        schema={aisaAnim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={aisaAnim08Schema.parse({})}
      />
      <Composition
        id="AisaAnim09SeoVersGeo"
        component={AisaAnim09SeoVersGeo}
        schema={aisaAnim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={aisaAnim09Schema.parse({})}
      />
      <Composition
        id="AisaAnim10OceanBleu"
        component={AisaAnim10OceanBleu}
        schema={aisaAnim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={aisaAnim10Schema.parse({})}
      />
      <Composition
        id="AisaAnim11TransitionStatistiques"
        component={AisaAnim11TransitionStatistiques}
        schema={aisaAnim11Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={aisaAnim11Schema.parse({})}
      />
      <Composition id="IdentiteV2Board" component={IdentiteV2Board} fps={30} width={1920} height={1080} durationInFrames={7} />
      <Composition id="MontageAisa" component={MontageAisa} fps={30} width={1920} height={1080} durationInFrames={Math.round(FULL_DURATION * 30)} />
      <Composition
        id="MontageAisaHook"
        component={MontageAisaHook}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={Math.round(HOOK_END * 30)}
      />
      <Composition
        id="MontageMinimax"
        component={MontageMinimax}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={MONTAGE_MINIMAX_FRAMES}
      />
      <Composition
        id="Atmos22Anim01QuestionReecrite"
        component={Atmos22Anim01QuestionReecrite}
        schema={atmos22Anim01Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={atmos22Anim01Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim02AvalancheIdees"
        component={Atmos22Anim02AvalancheIdees}
        schema={atmos22Anim02Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={atmos22Anim02Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim03Prompt47Idees"
        component={Atmos22Anim03Prompt47Idees}
        schema={atmos22Anim03Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={210}
        defaultProps={atmos22Anim03Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim04Elimination47a1"
        component={Atmos22Anim04Elimination47a1}
        schema={atmos22Anim04Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={165}
        defaultProps={atmos22Anim04Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim05TimelineDocumentee"
        component={Atmos22Anim05TimelineDocumentee}
        schema={atmos22Anim05Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={120}
        defaultProps={atmos22Anim05Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim06LowerThirdAnnees"
        component={Atmos22Anim06LowerThirdAnnees}
        schema={atmos22Anim06Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={atmos22Anim06Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim07AbonneCinetique"
        component={Atmos22Anim07AbonneCinetique}
        schema={atmos22Anim07Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={105}
        defaultProps={atmos22Anim07Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim08TroisFaussesExcuses"
        component={Atmos22Anim08TroisFaussesExcuses}
        schema={atmos22Anim08Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={180}
        defaultProps={atmos22Anim08Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim09ChargementBloque"
        component={Atmos22Anim09ChargementBloque}
        schema={atmos22Anim09Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={atmos22Anim09Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim10DispersionFocus"
        component={Atmos22Anim10DispersionFocus}
        schema={atmos22Anim10Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={150}
        defaultProps={atmos22Anim10Schema.parse({})}
      />
      <Composition
        id="Atmos22Anim11RegleCompteRebours"
        component={Atmos22Anim11RegleCompteRebours}
        schema={atmos22Anim11Schema}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={195}
        defaultProps={atmos22Anim11Schema.parse({})}
      />
    </>
  );
};
