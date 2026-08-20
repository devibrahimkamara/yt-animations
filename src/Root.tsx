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
    </>
  );
};
