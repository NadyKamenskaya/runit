import React, { useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalActions } from '../slices/modalSlice.js';
import { actions as editorActions } from '../slices/editorSlice.js';
import { fetchData } from '../slices/userSlice.js';
import classes from './Profile.module.css';
import Snippet from '../components/Snippet/Snippet.jsx';

function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const snippets = useSelector((state) => state.snippets.snippets);

  const parseDate = (date) => {
    try {
      return new Intl.DateTimeFormat().format(new Date(date));
    } catch {
      return t('profile.successfulLoading');
    }
  };

  const handleEditProfile = () => {
    dispatch(
      modalActions.openModal({
        type: 'editProfile',
        item: userInfo,
      }),
    );
  };

  const handleChangePassword = () => {
    dispatch(
      modalActions.openModal({
        type: 'changePassword',
        item: { id: userInfo.id },
      }),
    );
  };

  const handleGenNewRepl = () => {
    dispatch(editorActions.resetCode());
    dispatch(modalActions.openModal({ type: 'genNewRepl' }));
  };

  useEffect(() => {
    dispatch(fetchData())
      .unwrap()
      .catch((serializedError) => {
        const error = new Error(serializedError.message);
        error.name = serializedError.name;
        throw error;
      });
  }, []);

  return (
    <div className="main-content">
      <div className={`${classes.upperLine}`} />
      <div className={`h-100 w-100 px-3 bg-dark ${classes.container}`}>
        <Row className={`${classes.profileContainer}`}>
          <Col className={`col-md-3 px-2 rounded ${classes.profileColumn}`}>
            <div className={`w-100 ${classes.profile}`}>
              <div>
                <h1 className="my-2">{userInfo.login}</h1>
                <div>
                  {`${t('profile.email')} `}
                  <span className="text-muted">{userInfo.email}</span>
                </div>
                {/* "userdata.created_at", "userdata.id" are also available. Add if needed. */}
              </div>
              <div className={`${classes.profileButtons}`}>
                <Button
                  className={`${classes.button}`}
                  onClick={handleEditProfile}
                >
                  <div>
                    <span>{t('profile.editProfileButton')}</span>
                  </div>
                </Button>
              </div>
              <Button
                className={`${classes.button}`}
                onClick={handleChangePassword}
              >
                <div>
                  <span>{t('modals.changePassword.header')}</span>
                </div>
              </Button>
              <div className="gap" style={{ marginBottom: 'auto' }} />
              <div
                className="d-flex flex-md-column w-100"
                style={{ alignItems: 'center' }}
              >
                <span>{t('profile.createdAt')}</span>
                <span>{parseDate(userInfo.created_at)}</span>
              </div>
            </div>
          </Col>
          <Col className={`rounded w-100 ${classes.replsCol}`}>
            <div
              className={`w-100 h-100 d-flex flex-column ${classes.repls}`}
              style={{ paddingTop: '30px' }}
            >
              <Row
                className="my-2 flex-md-row"
                style={{ borderBottom: '1px solid #293746' }}
              >
                <div className="d-flex justify-content-between align-items-center flex-md-row w-100">
                  <h2>{t('profile.replsHeader')}</h2>
                  <div className={`${classes.newRepl}`}>
                    <Button
                      className={`${classes.newReplButton}`}
                      onClick={handleGenNewRepl}
                    >
                      {t('profile.newReplButton')}
                    </Button>
                  </div>
                </div>
              </Row>
              <Row xs={1} md={2} className="g-4 my-1">
                {snippets.map(({ id, slug, name, code }) => (
                  <Snippet
                    key={id}
                    id={id}
                    slug={slug}
                    name={name}
                    code={code}
                  />
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Profile;
