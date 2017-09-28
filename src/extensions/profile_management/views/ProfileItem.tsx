import Icon from '../../../controls/Icon';
import { Icon as TooltipIcon, IconButton } from '../../../controls/TooltipControls';
import { ComponentEx } from '../../../util/ComponentEx';
import { getSafe } from '../../../util/storeHelper';
import TransferIcon from './TransferIcon';

import { IProfile } from '../types/IProfile';
import { IProfileFeature } from '../types/IProfileFeature';

import * as I18next from 'i18next';
import * as React from 'react';

export interface IProps {
  t: I18next.TranslationFunction;
  active: boolean;
  available: boolean;
  profile: IProfile;
  gameName: string;
  features: IProfileFeature[];
  highlightGameId: string;

  onActivate: (profileId: string) => void;
  onClone: (profileId: string) => void;
  onRemove: (profileId: string) => void;
  onStartEditing: (id: string) => void;
  onSetHighlightGameId: (gameId: string) => void;
}

/**
 * presents profiles and allows creation of new ones
 *
 * @class ProfileView
 * @extends {React.Component<IConnectedProps, {}>}
 */
class ProfileItem extends ComponentEx<IProps, {}> {
  public render(): JSX.Element {
    const { t, active, available, features, gameName, highlightGameId, profile } = this.props;

    const enabledMods = Object.keys(profile.modState).reduce(
      (prev: number, key: string): number => {
        return profile.modState[key].enabled ? prev + 1 : prev;
    }, 0);

    // TODO: not using ListGroupItem because it puts the content into
    //       <p>-tags so it doesn't support 'complex' content

    const classes = ['list-group-item'];
    if (((highlightGameId !== undefined) && (highlightGameId !== profile.gameId))
        || !available) {
      classes.push('disabled');
    } else if (active) {
      classes.push('active');
    }

    return (
      <span className={classes.join(' ')} style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 0' }}>
          <h4 className='list-group-item-heading'>{`${gameName} - ${profile.name}`}</h4>
          <div className='list-group-item-text'>
            <ul className='profile-details'>
              <li>
                <TooltipIcon
                  id={profile.id}
                  name='wrench'
                  tooltip={t('Number of Mods enabled')}
                />
                {enabledMods}
              </li>
              {features.map(this.renderFeature)}
            </ul>
          </div>
        </div>
        <div className='profile-actions'>
          <TransferIcon
            t={t}
            disabled={!available}
            profile={profile}
            onSetHighlightGameId={this.props.onSetHighlightGameId}
          />
          <IconButton
            className='btn-embed'
            id={`btn-profile-select-${profile.id}`}
            disabled={active || !available}
            tooltip={t('Enable')}
            onClick={this.activate}
            icon='play'
          />
          <IconButton
            className='btn-embed'
            id={`btn-profile-clone-${profile.id}`}
            disabled={!available}
            tooltip={t('Clone')}
            onClick={this.cloneProfile}
            icon='clone'
          />
          <IconButton
            className='btn-embed'
            id={`btn-profile-edit-${profile.id}`}
            disabled={!available}
            tooltip={t('Edit')}
            onClick={this.startEditing}
            icon='edit'
          />
          <IconButton
            className='btn-embed'
            id={`btn-profile-remove-${profile.id}`}
            tooltip={t('Remove')}
            onClick={this.removeProfile}
            icon='remove'
          />
        </div>
      </span>
    );
  }

  private renderFeature = (feature: IProfileFeature): JSX.Element => {
    const { t, profile } = this.props;
    const id = `icon-profilefeature-${profile.id}-${feature.id}`;
    return (
      <li key={id}>
        <TooltipIcon
          id={id}
          className='icon-profile-feature'
          tooltip={t(feature.description)}
          name={feature.icon}
        />
        {
          this.renderFeatureValue(feature.type,
                                  getSafe(profile, ['features', feature.id], undefined))
        }
      </li>
    );
  }

  private renderFeatureValue(type: string, value: any) {
    const { t } = this.props;
    if (type === 'boolean') {
      return value === true ? t('yes') : t('no');
    }
  }

  private cloneProfile = () => {
    const { onClone, profile } = this.props;
    onClone(profile.id);
  }

  private removeProfile = () => {
    const { onRemove, profile } = this.props;
    onRemove(profile.id);
  }

  private activate = () => {
    const { onActivate, profile } = this.props;
    onActivate(profile.id);
  }

  private startEditing = () => {
    const { onStartEditing, profile } = this.props;
    onStartEditing(profile.id);
  }
}

export default ProfileItem as React.ComponentClass<IProps>;
