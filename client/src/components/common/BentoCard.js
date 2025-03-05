import React from 'react';
import { Paper, Box, Typography, Divider, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for Honk-inspired bento design
const BentoContainer = styled(Paper)(({ 
  theme, 
  clickable = false, 
  accent = 'none', 
  active = false,
  minHeight = 'auto',
  colorVariant = 'default'
}) => {
  // Define background colors for colorful cards
  const colorVariants = {
    default: '#FFFFFF',
    purple: theme.palette.background.card4 || '#F9E6FF',
    blue: theme.palette.background.card2 || '#E6F9FF',
    green: theme.palette.background.card3 || '#E9F9E9',
    orange: theme.palette.background.card1 || '#FFEFE0',
    yellow: theme.palette.background.card5 || '#FFF5E6'
  };

  return {
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: theme.spacing(3),
    backgroundColor: colorVariants[colorVariant],
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: colorVariant === 'default' ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
    minHeight: minHeight,
    boxShadow: theme.shadows[1],
    ...(clickable && {
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: theme.shadows[3],
      },
    }),
    ...(active && {
      boxShadow: `0px 0px 0px 2px ${theme.palette.primary.main}`,
      padding: theme.spacing(2.9),
    }),
    ...(accent === 'primary' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        borderRadius: '20px 20px 0 0',
      }
    }),
    ...(accent === 'secondary' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`,
        borderRadius: '20px 20px 0 0',
      }
    }),
    ...(accent === 'success' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
        borderRadius: '20px 20px 0 0',
      }
    }),
    ...(accent === 'warning' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
        borderRadius: '20px 20px 0 0',
      }
    }),
    ...(accent === 'info' && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: `linear-gradient(90deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
        borderRadius: '20px 20px 0 0',
      }
    }),
  };
});

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  fontSize: '1.1rem',
}));

const CardSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
}));

const StatsBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StatsNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2rem',
  lineHeight: 1.2,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StatsCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const CardAvatar = styled(Avatar)(({ theme, bgcolor = 'primary.main' }) => ({
  marginBottom: theme.spacing(2),
  width: 48,
  height: 48,
  backgroundColor: theme.palette[bgcolor.split('.')[0]][bgcolor.split('.')[1]] || bgcolor,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
}));

const FooterBox = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
}));

/**
 * BentoCard component for consistent card styling across the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle/description text
 * @param {React.ReactNode} props.icon - Icon to display with title
 * @param {React.ReactNode} props.avatar - Avatar component to display
 * @param {string} props.avatarBg - Background color for avatar (e.g., 'primary.main')
 * @param {React.ReactNode} props.action - Action component (button, icon, etc.) to display in header
 * @param {boolean} props.clickable - Whether the card should have hover effects
 * @param {function} props.onClick - Click handler for the card
 * @param {string} props.accent - Color accent for the card ('primary', 'secondary', 'success', etc.)
 * @param {boolean} props.active - Whether the card should be styled as active
 * @param {string} props.statsNumber - Large statistic number to display
 * @param {React.ReactNode} props.statsCaption - Caption for the stats number
 * @param {boolean} props.divider - Whether to show a divider after the title
 * @param {string} props.minHeight - Minimum height of the card
 * @param {string} props.colorVariant - Color variant for the card
 * @param {Object} props.sx - Additional styles to apply to the card
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.footer - Footer content
 */
const BentoCard = ({
  title,
  subtitle,
  icon,
  avatar,
  avatarBg = 'primary.main',
  action,
  clickable = false,
  onClick,
  accent = 'none',
  active = false,
  statsNumber,
  statsCaption,
  divider = false,
  minHeight = 'auto',
  colorVariant = 'default',
  sx = {},
  children,
  footer
}) => {
  return (
    <BentoContainer
      elevation={0}
      onClick={clickable ? onClick : undefined}
      clickable={clickable}
      accent={accent}
      active={active}
      minHeight={minHeight}
      colorVariant={colorVariant}
      sx={sx}
    >
      {/* Header with title, avatar/icon, and action */}
      {(title || avatar || icon || action) && (
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box flex={1}>
            {(avatar || icon) && (
              <CardAvatar bgcolor={avatarBg}>
                {avatar || icon}
              </CardAvatar>
            )}
            {title && <CardTitle variant="h6">{title}</CardTitle>}
            {subtitle && <CardSubtitle variant="subtitle2">{subtitle}</CardSubtitle>}
          </Box>
          {action && (
            <Box ml={2}>
              {action}
            </Box>
          )}
        </Box>
      )}

      {/* Statistics */}
      {statsNumber && (
        <StatsBox>
          <StatsNumber variant="h3">
            {statsNumber}
          </StatsNumber>
          {statsCaption && <StatsCaption>{statsCaption}</StatsCaption>}
        </StatsBox>
      )}

      {/* Optional divider */}
      {divider && <Divider sx={{ my: 2 }} />}

      {/* Main content */}
      {children}

      {/* Footer */}
      {footer && (
        <FooterBox>
          {divider && <Divider sx={{ mb: 2 }} />}
          {footer}
        </FooterBox>
      )}
    </BentoContainer>
  );
};

export default BentoCard; 