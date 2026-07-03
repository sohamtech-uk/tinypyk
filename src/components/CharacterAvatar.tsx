import type { CSSProperties } from 'react';
import type { CharacterAsset, Costume } from '../studio/characters';

type CharacterAvatarProps = {
  character: CharacterAsset;
  costume?: Costume;
  className?: string;
  label?: string;
};

export function CharacterAvatar({
  character,
  costume,
  className = '',
  label,
}: CharacterAvatarProps) {
  const style = {
    '--character-accent': character.accent,
    transform: costume?.transform,
    filter: costume?.filter,
  } as CSSProperties;

  if (character.image) {
    return (
      <img
        className={`character-avatar image-avatar ${className}`.trim()}
        src={character.image}
        alt={label ?? ''}
        style={style}
      />
    );
  }

  return (
    <span
      className={`character-avatar emoji-avatar ${className}`.trim()}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={style}
    >
      {character.emoji}
    </span>
  );
}
