import type { StageSprite } from '../studio/characters';
import { characterLibrary, getCharacter } from '../studio/characters';
import { CharacterAvatar } from './CharacterAvatar';

type SpriteAssetPanelProps = {
  mode: 'costumes' | 'sounds';
  activeSprite?: StageSprite;
  onCostumeChange: (spriteId: string, costumeIndex: number) => void;
  onPreviewSound: (name: string) => void;
};

export function SpriteAssetPanel({
  mode,
  activeSprite,
  onCostumeChange,
  onPreviewSound,
}: SpriteAssetPanelProps) {
  const activeCharacter = activeSprite ? getCharacter(activeSprite.characterId) : characterLibrary[0];
  const isCostumes = mode === 'costumes';

  return (
    <div className="sprite-asset-panel">
      <div className="asset-panel-hero">
        <CharacterAvatar
          character={activeCharacter}
          costume={activeCharacter.costumes[activeSprite?.costumeIndex ?? 0]}
          label={activeCharacter.name}
        />
        <div>
          <span>{isCostumes ? 'Costumes' : 'Sounds'}</span>
          <h2>{activeCharacter.name}</h2>
          <p>
            {isCostumes
              ? 'Choose a costume for the selected stage character.'
              : 'Preview friendly sounds for the selected stage character.'}
          </p>
        </div>
      </div>

      {isCostumes ? (
        <div className="costume-grid" aria-label={`${activeCharacter.name} costumes`}>
          {activeCharacter.costumes.map((costume, index) => (
            <button
              type="button"
              key={costume.name}
              className={index === activeSprite?.costumeIndex ? 'costume-card active' : 'costume-card'}
              onClick={() => {
                if (activeSprite) {
                  onCostumeChange(activeSprite.uid, index);
                }
              }}
            >
              <CharacterAvatar character={activeCharacter} costume={costume} />
              <span>{index + 1}</span>
              <strong>{costume.name}</strong>
            </button>
          ))}
        </div>
      ) : (
        <div className="sound-editor-list" aria-label={`${activeCharacter.name} sounds`}>
          {activeCharacter.sounds.map((sound) => (
            <button
              type="button"
              key={sound}
              className="sound-editor-card"
              onClick={() => onPreviewSound(sound)}
            >
              <span aria-hidden="true">▸</span>
              <div>
                <strong>{sound}</strong>
                <small>{activeCharacter.name} sound</small>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="asset-character-strip" aria-label="All available characters">
        {characterLibrary.map((character) => (
          <div key={character.id} className="asset-character-chip">
            <CharacterAvatar character={character} />
            <span>{character.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
