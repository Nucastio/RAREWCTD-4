export type SectionProps = {
    children: React.ReactNode,
    title: string,
    id?: NavItemType["name"],
}

export type HeadingProps = {
    title: string,
}

export type NavItemType = {
    url: string | null,
    name: string,
}

export type BookCharacterType = {
    id: string;
    name: string;
    imgUrl: string | null;
}
export type BookType = {
    id: number;
    name: string;
    imgUrl: string;
    characters: BookCharacterType[]
}

export type MessageType = {
    id: number;
    character: BookCharacterType;
    content: string;
    is_sender: boolean;
}

export type Metadata = {
    name: string;
    description: string;
    image: string;
    mediaType: string;
    interactiveMedia: {
        CrosschainCompatibility:
        | "Character Impersonations"
        | "AI Interactive Content"[];
        AIEnabledFeatures: "Wanchain" | "Ethereum" | "Polygon" | "Cardano"[];
    };
    files: {
        name: string;
        mediaType: string;
    }[];
}

export interface InputProps {
    title?: string;
    inputPlaceholder?: string;
    textArea?: boolean;
    value?: string | null;
    onChange: (value: string) => void;
    preview?: boolean;
}
