import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.playListSongs.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();

  // Create Artists
  const taylorSwift = await prisma.artist.create({
    data: {
      name: 'Taylor Swift',
    },
  });

  const theWeeknd = await prisma.artist.create({
    data: {
      name: 'The Weeknd',
    },
  });

  const billie = await prisma.artist.create({
    data: {
      name: 'Billie Eilish',
    },
  });

  const daftPunk = await prisma.artist.create({
    data: {
      name: 'Daft Punk',
    },
  });

  // Fetch all artists to confirm creation
  const allArtists = await prisma.artist.findMany();

  // Create Albums with Songs
  const album1989 = await prisma.album.create({
    data: {
      title: '1989',
      artistId: taylorSwift.id,
      releasedAt: new Date('2014-10-27'),
      songs: {
        create: [
          { title: 'Shake It Off', duration: 219, artistId: taylorSwift.id },
          { title: 'Blank Space', duration: 231, artistId: taylorSwift.id },
          { title: 'Style', duration: 231, artistId: taylorSwift.id },
          { title: 'Bad Blood', duration: 211, artistId: taylorSwift.id },
        ],
      },
    },
  });

  const afterHours = await prisma.album.create({
    data: {
      title: 'After Hours',
      artistId: theWeeknd.id,
      releasedAt: new Date('2020-03-20'),
      songs: {
        create: [
          { title: 'Blinding Lights', duration: 200, artistId: theWeeknd.id },
          { title: 'Save Your Tears', duration: 215, artistId: theWeeknd.id },
          { title: 'In Your Eyes', duration: 237, artistId: theWeeknd.id },
        ],
      },
    },
  });

  const whenWeAllFallAsleep = await prisma.album.create({
    data: {
      title: 'When We All Fall Asleep, Where Do We Go?',
      artistId: billie.id,
      releasedAt: new Date('2019-03-29'),
      songs: {
        create: [
          { title: 'bad guy', duration: 194, artistId: billie.id },
          { title: 'bury a friend', duration: 193, artistId: billie.id },
          { title: "when the party's over", duration: 196, artistId: billie.id },
        ],
      },
    },
  });

  const randomAccessMemories = await prisma.album.create({
    data: {
      title: 'Random Access Memories',
      artistId: daftPunk.id,
      releasedAt: new Date('2013-05-17'),
      songs: {
        create: [
          { title: 'Get Lucky', duration: 368, artistId: daftPunk.id },
          { title: 'Instant Crush', duration: 337, artistId: daftPunk.id },
          { title: 'Lose Yourself to Dance', duration: 353, artistId: daftPunk.id },
        ],
      },
    },
  });

  // Fetch all albums to confirm creation
  const allAlbums = await prisma.album.findMany();

  // Get all songs for playlists
  const allSongs = await prisma.song.findMany();

  // Create Playlists
  const workoutPlaylist = await prisma.playlist.create({
    data: {
      name: 'Workout Mix',
      description: 'High energy songs to power through your workout',
      songs: {
        create: [
          { songId: allSongs.find((s) => s.title === 'Shake It Off')!.id },
          { songId: allSongs.find((s) => s.title === 'Blinding Lights')!.id },
          { songId: allSongs.find((s) => s.title === 'bad guy')!.id },
          { songId: allSongs.find((s) => s.title === 'Get Lucky')!.id },
        ],
      },
    },
  });

  const chillVibes = await prisma.playlist.create({
    data: {
      name: 'Chill Vibes',
      description: 'Relaxing tunes for a calm evening',
      songs: {
        create: [
          { songId: allSongs.find((s) => s.title === 'Style')!.id },
          { songId: allSongs.find((s) => s.title === 'In Your Eyes')!.id },
          { songId: allSongs.find((s) => s.title === "when the party's over")!.id },
          { songId: allSongs.find((s) => s.title === 'Instant Crush')!.id },
        ],
      },
    },
  });

  const topHits = await prisma.playlist.create({
    data: {
      name: 'Top Hits 2010s-2020s',
      description: 'The biggest hits from the last decade',
      songs: {
        create: [
          { songId: allSongs.find((s) => s.title === 'Blank Space')!.id },
          { songId: allSongs.find((s) => s.title === 'Blinding Lights')!.id },
          { songId: allSongs.find((s) => s.title === 'Save Your Tears')!.id },
          { songId: allSongs.find((s) => s.title === 'bad guy')!.id },
          { songId: allSongs.find((s) => s.title === 'Get Lucky')!.id },
        ],
      },
    },
  });

  // Fetch all playlists to confirm creation
  const allPlaylists = await prisma.playlist.findMany();

  console.log('✅ Seed data created successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${allArtists.length} Artists`);
  console.log(`   - ${allAlbums.length} Albums`);
  console.log(`   - ${allSongs.length} Songs`);
  console.log(`   - ${allPlaylists.length} Playlists`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
