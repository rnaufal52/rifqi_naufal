"use client";

import {
  AvatarGroup,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@/once-ui/components";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  youtubeLinks?: string[]; // Tambah prop untuk YouTube links
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
  youtubeLinks = [], // Default empty array
}) => {
  // Function to check if a string is a YouTube URL
  const isYouTubeLink = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Function to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Separate images and YouTube links
  const mediaImages = images.filter((img) => !isYouTubeLink(img));
  const mediaYouTubeLinks = [
    ...images.filter((img) => isYouTubeLink(img)),
    ...youtubeLinks,
  ];

  return (
    <Column fillWidth gap="m">
      {/* Render Carousel untuk images */}
      {mediaImages.length > 0 && (
        <Carousel
          sizes="(max-width: 960px) 100vw, 960px"
          images={mediaImages.map((image) => ({
            src: image,
            alt: title,
          }))}
        />
      )}

      {/* Render YouTube embeds */}
      {mediaYouTubeLinks.length > 0 && (
        <Column gap="m" fillWidth>
          {mediaYouTubeLinks.map((youtubeLink, index) => {
            const videoId = getYouTubeId(youtubeLink);
            if (!videoId) return null;

            return (
              <div
                key={`youtube-${index}`}
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "56.25%", // 16:9 aspect ratio
                  height: 0,
                  borderRadius: "var(--radius-l)",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "var(--radius-l)",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`YouTube video - ${title}`}
                />
              </div>
            );
          })}
        </Column>
      )}

      <Flex
        mobileDirection="column"
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex flex={5}>
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          </Flex>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && (
              <AvatarGroup avatars={avatars} size="m" reverse />
            )}
            {description?.trim() && (
              <Text
                wrap="balance"
                variant="body-default-s"
                onBackground="neutral-weak"
              >
                {description}
              </Text>
            )}
            <Flex gap="24" wrap>
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
                >
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
