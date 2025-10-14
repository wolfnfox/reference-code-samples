import { Resolvers } from './generated/graphql/schema';
import { DateTime } from 'luxon';

export const resolvers: Resolvers = {
  Query: {
    artist: async (_parent, args, context) => {
      const { prisma } = context;
      const artist = await prisma.artist.findUnique({ where: { id: args.id } });
      return artist as any;
    },
    artists: async (_parent, _args, context) => {
      const { prisma } = context;
      const artists = await prisma.artist.findMany();
      return artists.map((artist) => artist as any);
    },
    album: async (_parent, args, context) => {
      const { prisma } = context;
      const album = await prisma.album.findUnique({ where: { id: args.id } });
      return album as any;
    },
    albums: async (_parent, args, context) => {
      const { artistId } = args;
      const { prisma } = context;
      const albums = await prisma.album.findMany({ where: { artistId } });
      return albums.map((album) => album as any);
    },
    song: async (_parent, args, context) => {
      const { prisma } = context;
      const song = await prisma.song.findUnique({ where: { id: args.id } });
      return song as any;
    },
    playlist: async (_parent, args, context) => {
      const { prisma } = context;
      const playlist = await prisma.playlist.findUnique({ where: { id: args.id } });
      return playlist as any;
    },
    playlists: async (_parent, _args, context) => {
      const { prisma } = context;
      const playlists = await prisma.playlist.findMany();
      return playlists.map(
        (playlist) =>
          ({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            createdAt: DateTime.fromJSDate(playlist.createdAt),
            updatedAt: playlist.updatedAt ? DateTime.fromJSDate(playlist.updatedAt) : undefined,
          }) as any,
      );
    },
    searchSongs: async (_parent, args, context) => {
      const { title } = args;
      const { prisma } = context;
      const songs = await prisma.song.findMany({
        where: { title: { contains: title, mode: 'insensitive' } },
      });
      return songs.map((song) => song as any);
    },
  },
  Mutation: {
    createPlaylist: async (_parent, args, context) => {
      const { name, description, songIds } = args.input;
      const { prisma } = context;
      const playlist = await prisma.playlist.create({
        data: {
          name,
          description,
          songs: {
            create: songIds.map((songId) => ({ songId })),
          },
        },
      });
      return {
        ...playlist,
        createdAt: DateTime.fromJSDate(playlist.createdAt),
        updatedAt: playlist.updatedAt ? DateTime.fromJSDate(playlist.updatedAt) : null,
      } as any;
    },
    addSongToPlaylist: async (_parent, args, context) => {
      const { playlistId, songId } = args.input;
      const { prisma } = context;
      const playlistSong = await prisma.playListSongs.create({
        data: {
          playlistId,
          songId,
        },
        include: { playlist: true },
      });
      const playlist = playlistSong.playlist;
      return {
        ...playlist,
        createdAt: DateTime.fromJSDate(playlist.createdAt),
        updatedAt: playlist.updatedAt ? DateTime.fromJSDate(playlist.updatedAt) : null,
      } as any;
    },
    removeSongFromPlaylist: async (_parent, args, context) => {
      const { playlistId, songId } = args.input;
      const { prisma } = context;
      const playlistSong = await prisma.playListSongs.delete({
        where: { playlistId_songId: { playlistId, songId } },
        include: { playlist: true },
      });
      const playlist = playlistSong.playlist;
      return {
        ...playlist,
        createdAt: DateTime.fromJSDate(playlist.createdAt),
        updatedAt: playlist.updatedAt ? DateTime.fromJSDate(playlist.updatedAt) : null,
      } as any;
    },
  },
  Album: {
    artist: async (parent, _args, context) => {
      const { prisma } = context;
      const album = await prisma.album.findUnique({ select: { artist: true }, where: { id: parent.id } });
      return album?.artist as any;
    },
    songs: async (parent, _args, context) => {
      const { prisma } = context;
      const songs = await prisma.song.findMany({ where: { albumId: parent.id } });
      return songs.map((song) => song as any);
    },
  },
  Artist: {
    albums: async (parent, _args, context) => {
      const { prisma } = context;
      const albums = await prisma.album.findMany({ where: { artistId: parent.id } });
      return albums.map(
        (album) =>
          ({
            ...album,
            releasedAt: album.releasedAt ? DateTime.fromJSDate(album.releasedAt) : null,
          }) as any,
      );
    },
  },
  Playlist: {
    songs: async (parent, _args, context) => {
      const { prisma } = context;
      const playlistWithSongs = await prisma.playListSongs.findMany({
        select: { song: true },
        where: { playlistId: parent.id },
      });
      return playlistWithSongs?.map((item) => item.song as any) || [];
    },
  },
  Song: {
    artist: async (parent, _args, context) => {
      const { prisma } = context;
      const song = await prisma.song.findUnique({ select: { artist: true }, where: { id: parent.id } });
      return song?.artist as any;
    },
    album: async (parent, _args, context) => {
      const { prisma } = context;
      const song = await prisma.song.findUnique({ select: { album: true }, where: { id: parent.id } });
      return {
        ...song?.album,
        releasedAt: song?.album?.releasedAt ? DateTime.fromJSDate(song.album.releasedAt) : null,
      } as any;
    },
  },
};
