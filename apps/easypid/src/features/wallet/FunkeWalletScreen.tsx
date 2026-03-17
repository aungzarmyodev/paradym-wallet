import { Trans, useLingui } from '@lingui/react/macro'
import { useCredentialsForDisplay } from '@package/agent'
import { useHaptics } from '@package/app/hooks'
import {
  CustomIcons,
  FlexPage,
  Heading,
  HeroIcons,
  IconContainer,
  Loader,
  Paragraph,
  XStack,
  YStack,
  ScrollView,
} from '@package/ui'
import { useRouter } from 'expo-router'
import { InboxIcon } from './components/InboxIcon'
import { useScrollViewPosition } from '@package/app/hooks'
import { FunkeCredentialCard } from '@package/app/components'

export function FunkeWalletScreen() {
  const { push } = useRouter()
  const { withHaptics } = useHaptics()

  const {
    handleScroll,
    isScrolledByOffset,
    scrollEventThrottle,
  } = useScrollViewPosition()

  const { credentials, isLoading: isLoadingCredentials } =
    useCredentialsForDisplay()

  const pushToMenu = withHaptics(() => push('/menu'))
  const pushToScanner = withHaptics(() => push('/scan'))

  const { t } = useLingui()

  return (
    <YStack fg={1} bg="$background">
      <FlexPage fg={1} flex-1={false} bg="transparent">
        <XStack pt="$6" px="$2" jc="space-between" ai="center">
          <IconContainer
            bg="white"
            aria-label="Menu"
            icon={<HeroIcons.Menu/>}
            onPress={pushToMenu}
          />
          <Paragraph fontSize={18} fontWeight="$bold" color={'$grey-500'} numberOfLines={1}>
            Credential List
          </Paragraph>
          <InboxIcon />
        </XStack>
        {isLoadingCredentials ? (
          <YStack ai="center" jc="center" mt="$6">
            <Loader />
          </YStack>
        ) : credentials.length > 0 ? (
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={scrollEventThrottle}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <YStack px="$2" pb="$12">
              {credentials.map((credential, index) => (
                <YStack
                  key={credential.id}
                  mt={index === 0 ? 0 : -120}
                  zIndex={index}
                >
                  <FunkeCredentialCard
                    issuerImage={{
                      url: credential.display.issuer.logo?.url,
                      altText:
                        credential.display.issuer.logo?.altText,
                    }}
                    textColor={credential.display.textColor}
                    name={credential.display.name}
                    backgroundImage={{
                      url:
                        credential.display.backgroundImage?.url,
                      altText:
                        credential.display.backgroundImage?.altText,
                    }}
                    bgColor={
                      credential.display.backgroundColor ??
                      '$grey-900'
                    }
                    onPress={() =>
                      push(
                        `/credentials/${credential.id}/attributes`
                      )
                    }
                  />
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        ) : (
          <Paragraph ta="center" mt="$6">
            <Trans id="credentials.emptyTitle">
              There's nothing here, yet
            </Trans>
          </Paragraph>
        )}
      </FlexPage>

      <XStack
        position="absolute"
        bottom="$10"
        left={0}
        right={0}
        jc="center"
      >
        <XStack
          ai="center"
          gap="$2"
          px="$5"
          py="$3"
          br="$10"
          bg="$primary-500"
          onPress={pushToScanner}
          pressStyle={{ opacity: 0.8 }}
        >
          <CustomIcons.Qr size={28} color="$white" />
          <Paragraph color="$white" fontWeight="$bold">
            Scan
          </Paragraph>
        </XStack>
      </XStack>
    </YStack>
  )
}